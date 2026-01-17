## 如何设计一个秒杀系统

| 步骤      | 其他                         |
| ------- | -------------------------- |
| Redis预热 | 预先加载商品库存信息                 |
| 库存扣减    | 依赖Redis的库存扣减               |
| MQ异步建单  | Redis扣减后，将购物信息发送到MQ，进行异步建单 |
| DB核对    | 核对库存                       |
## OOM问题排查

### 确认OOM问题类型

从异常信息中可以看到是什么类型的OOM

| 异常信息                       | 类型     | 排查方向                   |
| -------------------------- | ------ | ---------------------- |
| Java heap space            | 堆空间不足  | 内存泄露、对象优化、缓存设计优化、堆大小调整 |
| Metaspace                  | 元空间溢出  | 动态生成类优化、元空间大小调整        |
| GC overhead limit exceeded | GC效率低下 | 内存泄露、对象创建过速、大对象处理不当    |
|                            |        |                        |
### DUMP文件获取

JVM参数设置自动dump文件生成
```
-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=
```

也可以手动触发，但是会触发STW：
```shell
jmap -dump:file=heapdump.hprof <pid> // <pid> 是 Java 进程的进程 ID。
```

当发生OOM，堆、元空间都会生成`.hprof`文件，如果没有，则确认是直接内存OOM

### 分析与定位

## 常用的问题排查命令

### jstat -gcutil

```shell
jstat -gcutil <pid> [interval] [count]

#示例 进程12345，每 2 秒打印一次，共打印 5 次 
stat -gcutil 12345 2000 5
```
- `<pid>`：Java 进程 ID（可通过 `jps` 查看）
- `[interval]`：采样间隔（单位：毫秒），例如 `1000` 表示每秒输出一次
- `[count]`：采样次数，可选；若不指定，则持续输出直到手动终止（Ctrl+C）

输出结果：
```shell
S0 S1 E O M CCS YGC YGCT FGC FGCT GCT 
0.00 98.76 75.32 45.10 92.34 88.12 120 2.345 3 1.234 3.579
```

| 列名       | 含义                             | 说明                                                |
| -------- | ------------------------------ | ------------------------------------------------- |
| **S0**   | Survivor 0 区使用率 (%)            | 当前 Survivor 0 空间的使用百分比                            |
| **S1**   | Survivor 1 区使用率 (%)            | 当前 Survivor 1 空间的使用百分比  <br>（通常 S0 和 S1 只有一个在用）   |
| **E**    | Eden 区使用率 (%)                  | 新生代 Eden 区的使用百分比  <br>**频繁接近 100% → Young GC 频繁** |
| **O**    | Old 区（老年代）使用率 (%)              | **关键指标！持续增长且 Full GC 后不下降 → 内存泄漏**                |
| **M**    | Metaspace 使用率 (%)              | 元空间（JDK 8+）使用百分比  <br>（替代了永久代 PermGen）            |
| **CCS**  | Compressed Class Space 使用率 (%) | 压缩类指针空间使用率（与 M 相关）                                |
| **YGC**  | Young GC 次数                    | Minor GC 发生的总次数                                   |
| **YGCT** | Young GC 总耗时（秒）                | 所有 Young GC 累计耗时                                  |
| **FGC**  | Full GC 总耗时（秒）                 | 所有 Full GC 累计耗时                                   |
| **GCT**  | GC 总耗时（秒）                      | YGCT + FGCT                                       |
⚠️注意：不同 GC 算法（如 G1、ZGC、Shenandoah）的列名可能略有差异。例如 G1 中可能显示 `HU`（Humongous Used）等。
#### 场景 1：判断是否内存泄漏

- 观察 **O（Old Gen）** 列：
    - 如果 `O` 持续上升（如 60% → 70% → 80%...）
    - 即使发生 **Full GC（FGC 增加）**，`O` 也几乎不下降
    - → **极可能是内存泄漏**

#### 场景 2：判断 Young GC 是否过于频繁

- 观察 **E（Eden）** 列：
    - 如果 `E` 每隔几秒就从 0% 快速涨到 100%，然后归零（伴随 YGC +1）
    - 且 `YGCT` 增长很快
    - → 可能对象创建速率过高，或 Eden 区太小

#### 场景 3：判断是否频繁 Full GC（性能杀手）

- 观察 **FGC** 和 **FGCT**：
    - 如果 `FGC` 在短时间内快速增长（如 1 分钟内增加 10 次）
    - `FGCT` 占 `GCT` 大部分（如 >50%）
    - → 应用会严重卡顿，需立即排查老年代或元空间问题

#### 场景 4：观察元空间是否快满

- **M（Metaspace）** 接近 95%～100%
    - 可能动态生成类过多（如反射、CGLIB、Groovy 脚本）
    - 若继续增长可能触发 `Metaspace OOM`

### jmap -histo

```shell
jmap -histo [options] <pid>
```
- `<pid>`：目标 Java 进程 ID（可通过 `jps` 获取）
- `[options]`：
    - **不加选项**：只统计**存活对象**（live objects）
    - **`-all`**：统计**所有对象**（包括待回收的垃圾对象）

> ⚠️ 注意：执行 `jmap -histo` 会**触发一次 Full GC（仅限 `-histo`，不含 `-dump`）**，以确保统计的是“存活”对象。这会导致应用暂停（STW），**建议在业务低峰期使用**。

```
num #instances #bytes class name ---------------------------------------------- 
1: 200000 16000000 java.lang.String 
2: 150000 12000000 java.util.HashMap$Node 
3: 50000 8000000 byte[] 
4: 10000 1600000 com.example.User
...
```

| 列名         | 含义                         |
| ---------- | -------------------------- |
| num        | 排名序号（按对象数量或内存降序）           |
| #instances | 该类的实例数量                    |
| #bytes     | 这些实例总共占用的字节数（Shallow Size） |
| class name | 类的全限定名                     |
