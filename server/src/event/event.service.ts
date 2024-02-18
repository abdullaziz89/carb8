import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class EventService {

    constructor(
        private prismaService: PrismaService
    ) {
    }

    async findAll() {
        return this.prismaService.event.findMany();
    }

    async findAllEnable() {
        return this.prismaService.event.findMany({
            where: {
                enable: true
            }
        });
    }

    async findOne(id: string) {
        return this.prismaService.event.findUnique({
            where: {
                id: id
            }
        });
    }

    async create(data: any) {
        return this.prismaService.event.create({
            data: data
        });
    }

    async update(event: any) {
        return this.prismaService.event.update({
            where: {
                id: event.id
            },
            data: event
        });
    }

    updateEnable(id: string, enable: boolean) {
        return this.prismaService.event.update({
            where: {
                id: id
            },
            data: {
                enable: enable
            }
        });
    }

    async delete(id: string) {
        return this.prismaService.event.delete({
            where: {
                id: id
            }
        });
    }
}
