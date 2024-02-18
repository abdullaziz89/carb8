import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { MyCustomStorageEngine } from "./MyCustomStorageEngine";
import { MulterModule } from "@nestjs/platform-express";
import { CloudflareImagesInterceptor } from "./CloudflareImagesInterceptor";
import { FileController } from "./file.controller";

@Module({
  providers: [FileService, MyCustomStorageEngine, CloudflareImagesInterceptor],
  controllers: [FileController]
})
export class FileModule {}
