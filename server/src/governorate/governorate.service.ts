import { Injectable } from "@nestjs/common";
import { Governorate } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class GovernorateService {

  constructor(private prismaService: PrismaService) {
  }

  create(governorate: Governorate) {
    return this.prismaService.governorate.create({
      data: governorate
    });
  }

  findAll() {
    return this.prismaService.governorate.findMany();
  }

  findAllEnabled() {
    return this.prismaService.governorate.findMany({
      where: {
        enable: true
      }
    });
  }

  findOne(id: string) {
    return this.prismaService.governorate.findUnique({
      where: {
        id: id
      }
    });
  }

  update(governorate: Governorate) {
    return this.prismaService.governorate.update({
      data: governorate,
      where: {
        id: governorate.id
      }
    });
  }

  remove(id: string) {
    return this.prismaService.governorate.delete({
      where: {
        id: id
      }
    });
  }

  updateEnabled(id: string, payload: { enabled: boolean }) {
    return this.prismaService.governorate.update({
      where: {
        id: id
      },
      data: {
        enable: payload.enabled
      }
    });
  }
}
