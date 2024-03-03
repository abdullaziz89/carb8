import {Injectable} from '@nestjs/common';
import {Customer} from "@prisma/client";
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class CustomerService {

    constructor(private prismaService: PrismaService) {
    }

    create(customer: Customer) {
        return this.prismaService.customer.create({data: customer});
    }

    findAll() {
        return this.prismaService.customer.findMany();
    }

    findAllForBusiness(businessId: string) {
        return this.prismaService.customer.findMany({
            where: {
                FoodTurck: {
                    some: {
                        id: businessId
                    }
                }
            }
        });
    }

    findOne(id: string) {
        return this.prismaService.customer.findUnique({where: {id}});
    }

    update(id: string, customer: Customer) {
        return this.prismaService.customer.update({where: {id}, data: customer});
    }

    remove(id: string) {
        return this.prismaService.customer.delete({where: {id}});
    }

    findAllOrders(id: string) {

        return this.prismaService.order.findMany({
            where: {
                customer: {
                    id: id
                }
            },
            include: {
                product: true,
                invoice: {
                    include: {
                        paymentStatus: true,
                        Payment: true
                    }
                }
            }
        });
    }
}
