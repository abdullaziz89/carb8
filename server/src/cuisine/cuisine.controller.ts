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
import { Cuisine } from "@prisma/client";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles-guard.guard";
import { Roles } from "../role/role.decorator";
import { CloudflareImagesInterceptor } from "../file/CloudflareImagesInterceptor";
import {CuisineService} from "./cuisine.service";
import {FilesInterceptor} from "@nestjs/platform-express";

@Controller("cuisine")
export class CuisineController {

  constructor(
    private readonly cuisineService: CuisineService
  ) {
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["SUPER_ADMIN", "ADMIN"])
  @UseInterceptors(CloudflareImagesInterceptor)
  create(@UploadedFiles() files: any, @Body("cuisine") cuisine: any) {
    return this.cuisineService.create(JSON.parse(cuisine), files);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["SUPER_ADMIN", "ADMIN"])
  async findAll() {
    return await this.cuisineService.findAll();
  }

  @Get('enabled')
  async findAllEnabled() {
    return this.cuisineService.findAllEnabled();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["SUPER_ADMIN", "ADMIN"])
  findOne(@Param("id") id: string) {
    return this.cuisineService.findOne(id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["SUPER_ADMIN", "ADMIN"])
  update(@Body() cuisine: Cuisine) {
    return this.cuisineService.update(cuisine);
  }

  @Patch("view/:id")
  updateViews(@Param("id") id: string) {
    return this.cuisineService.updateViewCount(id);
  }

  @Patch("image")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["SUPER_ADMIN", "ADMIN"])
  @UseInterceptors(CloudflareImagesInterceptor)
  updateImg(@UploadedFiles() files, @Body("id") id: any) {
    return this.cuisineService.updateImg(id, files);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["SUPER_ADMIN", "ADMIN"])
  remove(@Param("id") id: string) {
    return this.cuisineService.remove(id);
  }
}
