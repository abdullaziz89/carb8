import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {PaymentStatusService} from "./payment-status.service";
import {Roles} from "../../role/role.decorator";
import {JwtAuthGuard} from "../../guards/jwt-auth.guard";
import {RolesGuard} from "../../guards/roles-guard.guard";
@Controller('payment-status')
export class PaymentStatusController {

    constructor(
        private paymentStatusService: PaymentStatusService
    ) { }

    @Post()
    @Roles(['SUPER_ADMIN', 'ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    create(@Body() body: { name: string }) {
        return this.paymentStatusService.create(body.name);
    }

    @Get()
    @Roles(['SUPER_ADMIN', 'ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    findAll() {
        return this.paymentStatusService.findAll();
    }

    @Get(':id')
    @Roles(['SUPER_ADMIN', 'ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    findOne(@Param('id') id: string) {
        return this.paymentStatusService.findOne(id);
    }

    @Patch(':id')
    @Roles(['SUPER_ADMIN', 'ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    update(@Param('id') id: string, @Body() body: { name: string }) {
        return this.paymentStatusService.update(id, body.name);
    }

    @Delete(':id')
    @Roles(['SUPER_ADMIN', 'ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    remove(@Param('id') id: string) {
        return this.paymentStatusService.remove(id);
    }
}
