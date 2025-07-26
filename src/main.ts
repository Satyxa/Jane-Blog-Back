import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer, ValidationError } from 'class-validator';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ErrorType, HttpExceptionFilter } from './exception.filter';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); // <--- вот это важно!
  app.enableCors({
    origin: 'http://localhost:4000', // ← укажи твой фронтенд
    credentials: true, // ← обязательно для работы с куками
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const errorsForRes: ErrorType[] = [];
        errors.forEach((e: ValidationError) => {
          const zeroKey = Object.keys(e.constraints!)[0];
          errorsForRes.push({
            field: e.property,
            message: e.constraints![zeroKey],
          });
        });
        throw new BadRequestException(errorsForRes);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Blog')
    .setDescription('Created by https://t.me/Satyxa (telegram)')
    .setVersion('0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token', // это ключ схемы
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);
  console.log(new Date().toISOString());
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
