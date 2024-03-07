import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {PaymentResponse} from "./PaymentResponse";
import {PrismaService} from "../prisma/prisma.service";
import {ConfigService} from "@nestjs/config";
import {Customer, Product} from "@prisma/client";
import {uuid} from 'uuidv4';
import {UPaymentService} from "./upayment/UPayment.service";

@Injectable()
export class PaymentService {

    constructor(
        private prismaService: PrismaService,
        private configService: ConfigService,
        private upaymentService: UPaymentService
    ) {
    }

    async paymentSuccess(paymentResponse: any) {

        let invoice = await this.prismaService.order.update({
            where: {
                id: paymentResponse.OrderID
            },
            data: {
                quickOrder: false
            },
            select: {
                invoiceId: true
            }
        });

        await this.prismaService.invoice.update({
            where: {
                id: invoice.invoiceId
            },
            data: {
                paymentStatus: {
                    connect: {
                        name: "PAID"
                    }
                }
            }
        });

        return this.configService.get("PAYMENT_REDIRECT_SUCCESS");
    }

    async paymentReject(paymentResponse: any) {
        let invoice = await this.prismaService.order.update({
            where: {
                id: paymentResponse.OrderID
            },
            data: {
                quickOrder: false
            },
            select: {
                invoiceId: true
            }
        });

        await this.prismaService.invoice.update({
            where: {
                id: invoice.invoiceId
            },
            data: {
                paymentStatus: {
                    connect: {
                        name: "REJECTED"
                    }
                }
            }
        });
        return this.configService.get("PAYMENT_REDIRECT_REJECT");
    }

    paymentNotify(paymentResponse: PaymentResponse) {
        // console.log("notify", paymentResponse);
    }

    async redirectToPayment(id: string) {
        return await this.prismaService.order.findUniqueOrThrow({
            where: {
                id: id
            },
            include: {
                FoodTurck: {
                    select: {
                        id: true,
                        nameEng: true
                    }
                },
                invoice: {
                    include: {
                        paymentStatus: true
                    }
                },
                product: true,
                customer: {
                    select: {
                        phone: true,
                    }
                }
            }
        })
            .then(async (order) => {

                // const business = await this.prismaService.business.findUnique({
                //   where: {
                //     id: order.customer.businessId
                //   },
                //   select: {
                //     name: true
                //   }
                // });

                return {
                    ...order,
                    foodTruckName: order.FoodTurck.nameEng,
                };
            })
            .catch((error) => {
                throw new HttpException("Invalid order", HttpStatus.BAD_REQUEST);
            });
    }

    async createOrder(body: { customer: Customer; products: Product[], foodTruckId: string, paymentMethod: string }) {

        const foodTruck = await this.prismaService.foodTruck.findUnique({
            where: {
                id: body.foodTruckId
            }
        });

        if (!foodTruck) {
            throw new HttpException("food truck not found", HttpStatus.BAD_REQUEST);
        }

        let paymentStatus = await this.prismaService.paymentStatus.findUnique({
            where: {
                name: "NEW"
            }
        });

        if (!paymentStatus) {
            paymentStatus = await this.prismaService.paymentStatus.create({
                data: {
                    name: "NEW",
                    enable: true
                }
            });
        }

        // create payment uuid id
        const paymentId = uuid();

        // create Payment
        const payment = await this.prismaService.payment.create({
            data: {
                Invoice: {
                    create: {
                        paymentStatus: {
                            connect: {id: paymentStatus.id}
                        },
                        paymentId: paymentId
                    },
                },
                method: body.paymentMethod,
                amount: await this.calculateTotalPrice(body.products),
                PaymentStatus: {
                    connect: {id: paymentStatus.id}
                }
            }
        });

        // create customer
        let customer = await this.prismaService.customer.upsert({
            where: {
                phone: body.customer.phone
            },
            update: {
                ...body.customer,
                FoodTurck: {
                    connect: {id: foodTruck.id}
                }
            },
            create: {
                ...body.customer,
                FoodTurck: {
                    connect: {id: foodTruck.id}
                }
            }
        });

        // create order
        return this.prismaService.order.create({
            data: {
                FoodTurck: {
                    connect: {id: foodTruck.id}
                },
                customer: {
                    connect: {id: customer.id}
                },
                product: {
                    createMany: {data: body.products}
                },
                invoice: {
                    connect: {id: payment.invoiceId}
                },
                totalPrice: await this.calculateTotalPrice(body.products)
            }
        });
    }

    async pay(orderId: string) {

        // check if order exist
        if (!this.prismaService.order.findUnique({where: {id: orderId}})) {
            throw new HttpException("Order not exist", HttpStatus.BAD_REQUEST);
        }

        // if order exist get the order and the invoice and update invoice paymentStatus to PENDING
        const order = await this.prismaService.order.findUnique({
            where: {
                id: orderId
            },
            include: {
                invoice: {
                    select: {
                        Payment: {
                            select: {
                                method: true
                            }
                        }
                    }
                },
                FoodTurck: {
                    select: {
                        id: true,
                    }
                }
            }
        });

        await this.prismaService.invoice.update({
            where: {
                id: order.invoiceId
            },
            data: {
                paymentStatus: {
                    connectOrCreate: {
                        where: {
                            name: "PENDING"
                        },
                        create: {
                            name: "PENDING",
                            enable: true
                        }
                    }
                }
            },
        });

        // get order customer
        const customer = await this.prismaService.customer.findFirst({
            where: {
                Order: {
                    some: {
                        id: orderId
                    }
                }
            }
        });

        // get order products
        const products = await this.prismaService.product.findMany({
            where: {
                orderId: orderId
            }
        });

        // get order business
        const foodTruck = await this.prismaService.foodTruck.findUnique({
            where: {
                id: order.foodTruckId
            },
            select: {
                iban: true,
                nameEng: true,
                foodTruckInfo: {
                    select: {
                        phoneNumber: true
                    }
                }
            }
        });

        return this.upaymentService.createPayment(foodTruck, order, customer, products);
    }

    private async calculateTotalPrice(products: Product[]) {
        let totalPrice = 0;
        for (let product of products) {
            totalPrice += product.price * product.quantity;
        }
        return totalPrice;
    }
}
