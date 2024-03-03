import {Injectable} from '@nestjs/common';
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class PaymentStatusService {

    constructor(
        private prismaService: PrismaService,
    ) {
    }

    create(paymentStatus: any) {
        return this.prismaService.paymentStatus.create({
            data: paymentStatus
        });
    }

    findAll() {
        return this.prismaService.paymentStatus.findMany();
    }

    findOne(id: string) {
        return this.prismaService.paymentStatus.findUnique({
            where: {
                id: id
            }
        });
    }

    update(id: string, paymentStatus: any) {
        return this.prismaService.paymentStatus.update({
            where: {
                id: id
            },
            data: {
                name: paymentStatus.name,
                enable: paymentStatus.enable
            }
        });
    }

    remove(id: string) {
        return this.prismaService.paymentStatus.delete({
            where: {
                id: id
            }
        });
    }

}
