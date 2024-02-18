import { Injectable } from '@nestjs/common';
import { Address } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AddressService {

  constructor(private prismaService: PrismaService) {
  }

  create(address: Address) {
    return this.prismaService.address.create({
      data: address,
    });
  }

  findAll() {
    return this.prismaService.address.findMany();
  }

  findOne(id: string) {
    return this.prismaService.address.findUnique({
      where: {
        id: id
      }
    });
  }

  update(address: Address) {
    return this.prismaService.address.update({
      data: address,
      where: {
        id: address.id
      }
    });
  }

  remove(id: string) {
    return this.prismaService.address.delete({
      where: {
        id: id
      }
    });
  }
}
