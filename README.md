# spring-boot-lab

Spring Boot 学习实验仓库，包含一个基础的 Spring Boot Web 应用和若干 Java 练习示例。

## 内容

- **贪吃蛇游戏**：`src/main/resources/static/index.html`，应用启动后访问首页即可游玩。
- **雪花 ID 生成器**：`src/main/java/SnowFlake.java`，另有 `com/example/Test.java`、`com/example/Car.java` 两个演示入口。
- **算法练习**：`src/main/java/com/example/loop/Test.java`（冒泡排序 + 二分查找）。

## 技术栈

- Java 21
- Spring Boot 3.4.3（spring-boot-starter-web）

## 运行

```bash
./mvnw spring-boot:run
```

浏览器访问 <http://localhost:8080/> 查看贪吃蛇游戏。

## 测试

```bash
./mvnw test
```

## 说明

本仓库为个人学习实验，非生产项目。`src/main/java` 下的 `SnowFlake.java`、`Test.java`、`Car.java`、`loop/Test.java` 均为带 `main` 方法的独立练习示例，与 Spring Boot 应用主流程无耦合。
