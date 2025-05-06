import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ResponseInterceptor } from './utils/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './utils/interceptors/global-exception-filter';
import { ValidationPipe } from '@nestjs/common';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  // Enable CORS for all origins
  app.enableCors({
    origin: true, // Allow all origins
    credentials: true, // Optional: Enable cookies and credentials
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  app.useGlobalInterceptors(new ResponseInterceptor());
}
bootstrap();
