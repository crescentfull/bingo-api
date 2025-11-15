import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Graceful shutdown 설정
  app.enableShutdownHooks();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);

  // SIGTERM, SIGINT 시그널 핸들링
  process.on("SIGTERM", async () => {
    console.log("SIGTERM signal received: closing HTTP server");
    await app.close();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    console.log("SIGINT signal received: closing HTTP server");
    await app.close();
    process.exit(0);
  });

  process.on("uncaughtException", async (error) => {
    console.error("Uncaught Exception:", error);
    await app.close();
    process.exit(1);
  });

  process.on("unhandledRejection", async (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    await app.close();
    process.exit(1);
  });
}

bootstrap();
