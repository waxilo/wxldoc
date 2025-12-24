## Bean生命周期

### 实例化

这是生命周期的起点。Spring IoC 容器通过反射机制调用 Bean 的构造函数来创建一个实例。此时对象刚刚被创建，属性还都是默认值。

### 属性注入

实例化后，容器开始为 Bean 注入所需的依赖，即通过 Setter 方法或字段反射的方式完成属性赋值 

### 初始化

这是流程最复杂的阶段，在属性赋值完成后进行，目的是让 Bean 准备好被使用。其执行顺序有明确规定 ：

1. **Aware 接口回调**：如果 Bean 实现了各种 `Aware`接口（如 `BeanNameAware`, `BeanFactoryAware`, `ApplicationContextAware`），容器会调用相应方法，使 Bean 能感知到自身在容器中的环境 。
2. **`BeanPostProcessor`的初始化前处理**：这是 Spring 一个强大的扩展点。所有实现了 `BeanPostProcessor`接口的类，其 `postProcessBeforeInitialization`方法会在此刻被调用，允许对 Bean 进行修改 。
3. **初始化方法执行**：这是 Bean 自身定义初始化逻辑的阶段，有三种方式，**执行顺序固定为**：
   1. `@PostConstruct`注解标记的方法 
   2. `InitializingBean`接口的 `afterPropertiesSet()`方法 
   3. 通过 XML 或 `@Bean`注解指定的自定义 `init-method`

### 销毁

当 Spring 容器（通常是 `ApplicationContext`）关闭时，单例 Bean 进入销毁阶段。销毁方法的执行顺序与初始化相反 ：

1. `@PreDestroy`注解标记的方法 

2. `DisposableBean`接口的 `destroy()`方法 

3. 通过 XML 或 `@Bean`注解指定的自定义 `destroy-method`


## 作用域对生命周期的影响

Singleton：容器启动时创建（若为懒加载则首次使用时创建），容器关闭时销毁。

Prototype‌：每次请求时创建，销毁由客户端代码或垃圾回收控制（Spring 不管理原型 Bean 的销毁）。

Request：每次 HTTP 请求创建，请求结束销毁。

Session：用户会话期间存在，会话超时或注销时销毁。

