import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class VoucherService {

    constructor(
        private prismaService: PrismaService
    ) {
    }

    // only for super admin
    async getVouchers() {
        return this.prismaService.voucher.findMany();
    }

    // get food truck vouchers
    async getFoodTruckVouchers(foodTruckId: string) {
        return this.prismaService.voucher.findMany({
            where: {
                foodTruckId: foodTruckId
            }
        });
    }

    // check if voucher exists
    async checkVoucher(voucherCode: string) {
        return this.prismaService.voucher.findFirst({
            where: {
                code: voucherCode
            }
        });
    }

    // create voucher
    async createVoucher(data: any) {
        return this.prismaService.voucher.create({
            data: data
        });
    }

    // update voucher
    async updateVoucher(voucherId: string, data: any) {
        return this.prismaService.voucher.update({
            where: {
                id: voucherId
            },
            data: data
        });
    }

    // delete voucher
    async deleteVoucher(voucherId: string) {
        return this.prismaService.voucher.delete({
            where: {
                id: voucherId
            }
        });
    }
}
