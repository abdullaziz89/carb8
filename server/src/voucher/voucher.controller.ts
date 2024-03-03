import {Body, Controller, Get, Patch, Post, UseGuards} from '@nestjs/common';
import {VoucherService} from "./voucher.service";
import {Roles} from "../role/role.decorator";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {RolesGuard} from "../guards/roles-guard.guard";

@Controller('voucher')
export class VoucherController {

    constructor(private readonly voucherService: VoucherService) {
    }

    // only for super admin
    @Get()
    @Roles(['SUPER_ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getVouchers() {
        return this.voucherService.getVouchers();
    }

    // get food truck vouchers
    @Get('food-truck')
    @Roles(['FOOD_TRUCK'])
    @UseGuards(JwtAuthGuard)
    async getFoodTruckVouchers(@Body() foodTruckId: string) {
        return this.voucherService.getFoodTruckVouchers(foodTruckId);
    }

    // check if voucher exists
    @Get('check')
    @UseGuards(JwtAuthGuard)
    async checkVoucher(@Body() voucherCode: string) {
        return this.voucherService.checkVoucher(voucherCode);
    }

    // create voucher
    @Post()
    @Roles(['SUPER_ADMIN', 'FOOD_TRUCK'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    async createVoucher(@Body() payload: any) {
        return this.voucherService.createVoucher(payload);
    }

    // update voucher
    @Patch()
    @Roles(['SUPER_ADMIN', 'FOOD_TRUCK'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updateVoucher(@Body() voucherId: string, @Body() payload: any) {
        return this.voucherService.updateVoucher(voucherId, payload);
    }

    // delete voucher
    @Patch('delete')
    @Roles(['SUPER_ADMIN', 'FOOD_TRUCK'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    async deleteVoucher(@Body() voucherId: string) {
        return this.voucherService.deleteVoucher(voucherId);
    }
}
