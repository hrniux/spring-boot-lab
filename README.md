# spring-boot-lab

Spring Boot 学习实验仓库，包含一个基础的 Spring Boot Web 应用、一个带参数校验与统一错误处理的 REST API 示例，以及若干 Java 练习示例。

## 内容

- **Task REST API**（`/api/tasks`）：展示构造器注入、`@Valid` 参数校验、REST 规范状态码、`ProblemDetail`（RFC 7807）统一错误响应、内存仓储，以及完整的单元 + MockMvc 集成测试。
- **贪吃蛇游戏**：`src/main/resources/static/index.html`，应用启动后访问首页即可游玩。
- **雪花 ID 生成器**：`com.example.demo.id.SnowFlake`（原在默认包，已移入正规包）。
- **算法练习**：`com/example/loop/Test.java`（冒泡排序 + 二分查找，独立 `main`）。

## 技术栈

- Java 21
- Spring Boot 3.4.3（spring-boot-starter-web、spring-boot-starter-validation）

## 运行

```bash
./mvnw spring-boot:run
```

浏览器访问 <http://localhost:8080/> 查看贪吃蛇游戏。

### Task API 示例

```bash
# 创建任务
curl -X POST http://localhost:8080/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"学习 Spring"}'

# 列出任务
curl http://localhost:8080/api/tasks

# 完成任务
curl -X PATCH http://localhost:8080/api/tasks/1/complete
```

- 空标题提交返回 `400`（`ProblemDetail` 校验错误）。
- 完成不存在的任务返回 `404`。

## 测试

```bash
./mvnw test
```

贪吃蛇回归测试使用 Node.js 22 的内置测试工具，无需安装 npm 依赖：

```bash
node --test test/snake.test.cjs
```

CI 同时运行 Maven 完整构建与游戏回归测试。

## 说明

本仓库为个人学习实验，非生产项目。`src/main/java` 下的 `Test.java`、`Car.java`、`loop/Test.java` 为带 `main` 方法的独立练习示例，与 Spring Boot 应用主流程无耦合。
