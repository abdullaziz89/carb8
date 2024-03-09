import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Product } from "@prisma/client";
import { UpdatedOrderProducts } from "./order.controller";

@Injectable()
export class OrderService {

  constructor(
    private readonly prismaService: PrismaService
  ) {
  }

  async getOrder(orderId: string) {
    return this.prismaService.order.findUnique({
      where: {
        id: orderId
      },
      include: {
        invoice: {
          select: {
            paymentStatus: true
          }
        }
      }
    });
  }

  async updateOrderProducts(orderProducts: { orderId: string; products: UpdatedOrderProducts }) {

    let tbr: boolean = false;

    // delete products from products array
    if (orderProducts.products.delete.length > 0) {
      await this.prismaService.product.deleteMany({
        where: {
          id: {
            in: orderProducts.products.delete
          }
        }
      });
    }

    // merge create and update products
    const createdUpdatedProducts = orderProducts.products.create.concat(orderProducts.products.update);

    const totalPrice = await this.calculateTotalPrice(createdUpdatedProducts);

    // create and update products
    if (orderProducts.products.create.length > 0) {

      // add orderId to products
      orderProducts.products.create = orderProducts.products.create.map(product => {

        // delete id from product
        delete product.id;

        return {
          ...product,
          orderId: orderProducts.orderId
        }
      })

      await this.prismaService.product.createMany({
        data: orderProducts.products.create
      });
    }

    if (orderProducts.products.update.length > 0) {

      for (let product of orderProducts.products.update) {
        tbr = await this.prismaService.product.update({
          where: {
            id: product.id
          },
          data: {
            name: product.name,
            price: product.price,
            quantity: product.quantity
          }
        }) !== null;
      }
    }

    tbr = await this.prismaService.order.update({
      where: {
        id: orderProducts.orderId
      },
      data: {
        totalPrice: totalPrice
      }
    }) !== null;

    return tbr;
  }

  private async calculateTotalPrice(products: Product[]) {
    let totalPrice = 0;
    for (let product of products) {
      totalPrice += product.price * product.quantity;
    }
    return totalPrice;
  }
}
