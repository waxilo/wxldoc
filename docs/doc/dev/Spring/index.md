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

| 类型         | 描述                                              |
| ---------- | ----------------------------------------------- |
| Singleton  | 容器启动时创建（若为懒加载则首次使用时创建），容器关闭时销毁。                 |
| Prototype‌ | 每次请求时创建，销毁由客户端代码或垃圾回收控制（Spring 不管理原型 Bean 的销毁）。 |
| Request    | 每次 HTTP 请求创建，请求结束销毁。                            |
| Session    | 用户会话期间存在，会话超时或注销时销毁。                            |

## 依赖注入（DI）

### 注入方式

**1. 构造器注入**
```java
@Component
public class UserService {
    private final UserRepository repository;
    
    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
```

**2. Setter 注入**
```java
@Component
public class UserService {
    private UserRepository repository;
    
    @Autowired
    public void setRepository(UserRepository repository) {
        this.repository = repository;
    }
}
```

**3. 字段注入**
```java
@Component
public class UserService {
    @Autowired
    private UserRepository repository;
}
```

### 注入方式对比

| 方式 | 优点 | 缺点 |
|------|------|------|
| 构造器注入 | 强制依赖、不可变、易于测试 | 构造器参数过多时冗长 |
| Setter 注入 | 可选依赖、可重新注入 | 可能为 null |
| 字段注入 | 简洁、代码量少 | 难以测试、隐藏依赖 |

## AOP（面向切面编程）

### 核心概念

- **切面（Aspect）**：封装横切关注点的模块
- **通知（Advice）**：切面的具体行为
- **连接点（Join Point）**：程序执行过程中的某个点
- **切点（Pointcut）**：匹配连接点的表达式
- **织入（Weaving）**：将切面应用到目标对象

### 通知类型

| 通知类型 | 执行时机 |
|----------|----------|
| `@Before` | 目标方法执行前 |
| `@After` | 目标方法执行后（无论是否异常） |
| `@AfterReturning` | 目标方法正常返回后 |
| `@AfterThrowing` | 目标方法抛出异常后 |
| `@Around` | 环绕目标方法 |

### AOP 实现原理

**JDK 动态代理**：
- 基于接口
- 使用 `Proxy.newProxyInstance()` 创建代理对象

**CGLIB 动态代理**：
- 基于类继承
- 创建目标类的子类作为代理对象

### 示例

```java
@Aspect
@Component
public class LoggingAspect {
    
    @Before("execution(* com.example.service.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        System.out.println("Method " + methodName + " is called");
    }
    
    @Around("execution(* com.example.service.*.*(..))")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long endTime = System.currentTimeMillis();
        System.out.println("Method " + joinPoint.getSignature().getName() 
            + " executed in " + (endTime - startTime) + "ms");
        return result;
    }
}
```

## Spring Boot 自动配置

### 原理

1. **@EnableAutoConfiguration**：启用自动配置
2. **SpringFactoriesLoader**：加载 `META-INF/spring.factories`
3. **@Conditional**：根据条件决定是否生效

### 常用条件注解

| 注解 | 条件 |
|------|------|
| `@ConditionalOnClass` | 类存在时 |
| `@ConditionalOnMissingClass` | 类不存在时 |
| `@ConditionalOnBean` | Bean 存在时 |
| `@ConditionalOnMissingBean` | Bean 不存在时 |
| `@ConditionalOnProperty` | 属性满足条件时 |

### 自定义自动配置

```java
@Configuration
@ConditionalOnClass(MyService.class)
@EnableConfigurationProperties(MyProperties.class)
public class MyAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean
    public MyService myService(MyProperties properties) {
        return new MyService(properties.getConfig());
    }
}
```

## Spring 事务管理

### 事务传播行为

| 传播行为 | 说明 |
|----------|------|
| `REQUIRED` | 如果当前没有事务，创建新事务；如果有，加入当前事务 |
| `SUPPORTS` | 如果当前有事务，加入；否则以非事务方式执行 |
| `MANDATORY` | 必须在事务中执行，否则抛出异常 |
| `REQUIRES_NEW` | 总是创建新事务，挂起当前事务 |
| `NOT_SUPPORTED` | 以非事务方式执行，挂起当前事务 |
| `NEVER` | 以非事务方式执行，有事务则抛出异常 |
| `NESTED` | 如果当前有事务，嵌套事务执行 |

### 事务隔离级别

| 隔离级别 | 说明 |
|----------|------|
| `DEFAULT` | 使用数据库默认隔离级别 |
| `READ_UNCOMMITTED` | 读未提交 |
| `READ_COMMITTED` | 读已提交 |
| `REPEATABLE_READ` | 可重复读 |
| `SERIALIZABLE` | 串行化 |

### 示例

```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository repository;
    
    @Transactional(propagation = Propagation.REQUIRED, isolation = Isolation.READ_COMMITTED)
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        // 扣除余额
        repository.decreaseBalance(fromId, amount);
        // 添加余额
        repository.increaseBalance(toId, amount);
    }
}
```
