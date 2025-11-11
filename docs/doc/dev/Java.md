## ArrayList知识点

### 参考文档

[全面解析ArrayList，超详细](https://www.cnblogs.com/codingkf/p/19079098)

### 扩容机制

```java
List<Object> list = new ArrayList<>();
```

执行以上代码，实际是创建一个容量为 0 的空数组。

当执行第一次新增时，实际大小为 1，大于容量，触发 grow 扩容。

grow 是调用 Arrays.copyOf 创建一个 1.5 倍容量的新数组，并覆盖对象引用。


## Synchronized锁详解

[大彻大悟synchronized原理，锁的升级Synchronized原理是面试中的一个难点。网上的各种资料太乱了 ，概 - 掘金](https://juejin.cn/post/6894099621694406669)

## 运行时数据区
[运行时数据区](https://www.cnblogs.com/javastack/p/13391983.html)

## 垃圾回收算法
[JVM的垃圾回收机制——垃圾回收算法 - 知乎](https://zhuanlan.zhihu.com/p/159200599)

## 垃圾回收器
[一文彻底搞懂八种JVM垃圾回收器_垃圾回收器有几种-CSDN博客](https://blog.csdn.net/weixin_44772566/article/details/136248892)
