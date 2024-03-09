import {Body, Controller, Get, Param, Put} from "@nestjs/common";
import {OrderService} from "./order.service";
import {Product} from "@prisma/client";

export interface UpdatedOrderProducts {
    create: Product[];
    update: Product[];
    delete: string[];
}

@Controller('order')
export class OrderController {

    constructor(
        private readonly orderService: OrderService,
    ) {
    }

    @Get(':orderId')
    async getOrder(@Param('orderId') orderId: string): Promise<any> {
        return await this.orderService.getOrder(orderId);
    }

    // update order products
    @Put('products')
    async updateOrderProducts(@Body() orderProducts: {
        orderId: string,
        products: UpdatedOrderProducts
    }): Promise<any> {
        return await this.orderService.updateOrderProducts(orderProducts);
    }
}
