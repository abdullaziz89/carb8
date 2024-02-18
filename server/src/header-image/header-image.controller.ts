import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Roles } from "../role/role.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles-guard.guard";
import { HeaderImageService } from "./header-image.service";
import { CloudflareImagesInterceptor } from "../file/CloudflareImagesInterceptor";
import { HeaderImage } from "@prisma/client";

@Controller("header-image")
export class HeaderImageController {

  constructor(
    private headerImageService: HeaderImageService
  ) {
  }

  @Get()
  @Roles(["SUPER_ADMIN", "ADMIN"])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll() {
    return this.headerImageService.findAll();
  }

  @Get("enabled")
  async findAllEnabled() {
    return this.headerImageService.findAllEnabled();
  }

  @Post()
  @Roles(["SUPER_ADMIN", "ADMIN"])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(CloudflareImagesInterceptor)
  async create(@Body("headerImage") headerImage: any, @UploadedFiles() files: any) {
    return this.headerImageService.create(headerImage, files);
  }

  @Get(":id")
  async findOne(@Param('id') id: string) {
    return this.headerImageService.findOne(id);
  }

  @Patch(":id")
  @Roles(["SUPER_ADMIN", "ADMIN"])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(CloudflareImagesInterceptor)
  async update(@Body("headerImage") headerImage: HeaderImage, @UploadedFiles() files: any) {
    return this.headerImageService.update(headerImage, files);
  }

  @Patch("enable")
  @Roles(["SUPER_ADMIN", "ADMIN"])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async enable(@Body() payload: any) {
    return this.headerImageService.updateEnable(payload.id, payload.enable);
  }

  @Patch("view/:id")
  updateClicks(@Param("id") id: string) {
    return this.headerImageService.updateClicks(id);
  }

  @Delete(":id")
  @Roles(["SUPER_ADMIN", "ADMIN"])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Param('id') id: string) {
    return this.headerImageService.remove(id);
  }
}
