import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { FoodTruckInformation } from "@prisma/client";

@Injectable()
export class InformationService {

  constructor(
    private prismaService: PrismaService
  ) {
  }

  async update(information: FoodTruckInformation) {
    return this.prismaService.foodTruckInformation.update({
      where: {
        id: information.id
      },
      data: information
    });
  }
}
