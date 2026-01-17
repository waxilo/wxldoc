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