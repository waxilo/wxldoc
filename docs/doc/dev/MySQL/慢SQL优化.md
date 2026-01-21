
| 场景        | 问题                                            | 解决                     |
| --------- | --------------------------------------------- | ---------------------- |
| 无索引       | 表数据量大，但查询字段未建立索引，导致全表扫描                       | 创建索引                   |
| 索引失效      | or、not、!=、前缀like等                             | 失效问题修复                 |
| 大表`join`  | 多张大表；关联字段无索引                                  | 添加索引、小表驱动大表、子查询替换为join |
| 分页查询偏移量大  | 如 `LIMIT 1000000, 10`，MySQL 需要扫描前 100 万行再返回结果 | 使用游标方式                 |
| 排序、分组未走索引 |                                               | 调整字段或添加索引              |
| 锁竞争       | 长事务锁竞争场景                                      | 细化事务粒度、尝试使用快照读         |

## 1. 开启慢查询日志
```sql
-- 查看是否开启慢查询日志 
SHOW VARIABLES LIKE 'slow_query_log'; 

-- 设置慢查询阈值（单位：秒） 
SET GLOBAL long_query_time = 1; 

-- 记录未使用索引的查询（可选） 
SET GLOBAL log_queries_not_using_indexes = ON;`
```

## 2. EXPLAIN分析

使用 `EXPLAIN` 或 `EXPLAIN FORMAT=JSON`：
```sql
EXPLAIN SELECT * FROM users WHERE name LIKE '%john%';
```

关注：

- `type`: `ALL` = 全表扫描（坏），`ref`/`range` = 用索引（好）
- `key`: 实际使用的索引
- `rows`: 扫描行数
- `Extra`: 是否有 `Using index`（覆盖索引）、`Using filesort` 等

