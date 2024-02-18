import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { GovernorateService } from './governorate.service';
import { Governorate } from "@prisma/client";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles-guard.guard";
import { Roles } from "../role/role.decorator";

@Controller('governorate')
export class GovernorateController {

  constructor(private readonly governorateService: GovernorateService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["SUPER_ADMIN", "ADMIN"])
  create(@Body() governorate: Governorate) {
    return this.governorateService.create(governorate);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["SUPER_ADMIN", "ADMIN"])
  findAll() {
    return this.governorateService.findAll();
  }

  @Get("/enabled")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["SUPER_ADMIN", "ADMIN"])
  findAllEnabled() {
    return this.governorateService.findAllEnabled();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["SUPER_ADMIN", "ADMIN"])
  findOne(@Param("id") id: string) {
    return this.governorateService.findOne(id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["SUPER_ADMIN", "ADMIN"])
  update(@Body() governorate: Governorate) {
    return this.governorateService.update(governorate);
  }

  @Patch(":id/enabled")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["SUPER_ADMIN", "ADMIN"])
  updateEnabled(@Param("id") id: string, @Body() payload: { enabled: boolean }) {
    return this.governorateService.updateEnabled(id, payload);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["SUPER_ADMIN", "ADMIN"])
  remove(@Param("id") id: string) {
    return this.governorateService.remove(id);
  }
}
