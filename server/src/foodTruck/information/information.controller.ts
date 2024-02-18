import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { Roles } from "../../role/role.decorator";
import { FoodTruck, FoodTruckInformation } from "@prisma/client";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { RolesGuard } from "../../guards/roles-guard.guard";
import { InformationService } from "./information.service";

@Controller("food-truck/information")
export class InformationController {

  constructor(
    private readonly informationService: InformationService
  ) {
  }

  @Patch()
  @Roles(["SUPER_ADMIN", "ADMIN"])
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Body() information: FoodTruckInformation) {
    return this.informationService.update(information);
  }
}
