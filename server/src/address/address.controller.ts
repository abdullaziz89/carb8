import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { AddressService } from "./address.service";
import { Address } from "@prisma/client";
import { Roles } from "../role/role.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles-guard.guard";

@Controller("address")
export class AddressController {
  constructor(private readonly addressService: AddressService) {
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["SUPER_ADMIN", "ADMIN"])
  create(@Body() address: Address) {
    return this.addressService.create(address);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["SUPER_ADMIN", "ADMIN"])
  findAll() {
    return this.addressService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["SUPER_ADMIN", "ADMIN"])
  findOne(@Param("id") id: string) {
    return this.addressService.findOne(id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["SUPER_ADMIN", "ADMIN"])
  update(@Body() address: Address) {
    return this.addressService.update(address);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["SUPER_ADMIN", "ADMIN"])
  remove(@Param("id") id: string) {
    return this.addressService.remove(id);
  }
}
