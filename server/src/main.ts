import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as multer from 'multer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(multer().array('files'));
  app.use(cookieParser());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Check List App')
    .setDescription('Check List App API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swaggerapi', app, document);

  await app.listen(3000);
}
bootstrap();
