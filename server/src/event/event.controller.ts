import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {EventService} from "./event.service";
import {Roles} from "../role/role.decorator";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {RolesGuard} from "../guards/roles-guard.guard";

@Controller('event')
export class EventController {

    constructor(
        private eventService: EventService
    ) {
    }

    @Get()
    @Roles(['SUPER_ADMIN', 'ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    async findAll() {
        return this.eventService.findAll();
    }

    @Get('enable')
    async findAllEnable() {
        return this.eventService.findAllEnable();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.eventService.findOne(id);
    }

    @Post()
    @Roles(['SUPER_ADMIN', 'ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    async create(@Body() data: any) {
        return await this.eventService.create(data);
    }

    @Patch()
    @Roles(['SUPER_ADMIN', 'ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    async update(@Body() event: any) {
        return await this.eventService.update(event);
    }

    @Patch('enable/:id')
    @Roles(['SUPER_ADMIN', 'ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updateStatus(@Param('id') id: string, @Body() event: {status: boolean}) {
        return this.eventService.updateEnable(id, event.status);
    }

    @Delete(':id')
    @Roles(['SUPER_ADMIN', 'ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    async remove(@Param('id') id: string) {
        return await this.eventService.delete(id);
    }
}
