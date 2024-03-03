import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import {CustomerService} from './customer.service';
import {Customer} from "@prisma/client";
import {Roles} from "../../role/role.decorator";
import {JwtAuthGuard} from "../../guards/jwt-auth.guard";
import {RolesGuard} from "../../guards/roles-guard.guard";

@Controller('customer')
export class CustomerController {

    constructor(private readonly customerService: CustomerService) {
    }

    @Post()
    @Roles(['SUPER_ADMIN', 'BUSINESS_ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    create(@Body() customer: Customer) {
        return this.customerService.create(customer);
    }

    @Get()
    @Roles(['SUPER_ADMIN', 'BUSINESS_ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    findAll() {
        return this.customerService.findAll();
    }

    @Get('business/:businessId')
    @Roles(['SUPER_ADMIN', 'BUSINESS_ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    findAllBusiness(@Param('businessId') businessId: string) {
        return this.customerService.findAllForBusiness(businessId);
    }

    @Get(':id')
    @Roles(['SUPER_ADMIN', 'BUSINESS_ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    findOne(@Param('id') id: string) {
        return this.customerService.findOne(id);
    }

    @Patch(':id')
    @Roles(['SUPER_ADMIN', 'BUSINESS_ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    update(@Param('id') id: string, @Body() customer: Customer) {
        return this.customerService.update(id, customer);
    }

    @Delete(':id')
    @Roles(['SUPER_ADMIN', 'BUSINESS_ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    remove(@Param('id') id: string) {
        return this.customerService.remove(id);
    }

    @Get('orders/:id')
    @Roles(['SUPER_ADMIN', 'BUSINESS_ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    findAllOrders(@Param('id') id: string) {
        return this.customerService.findAllOrders(id);
    }
}
