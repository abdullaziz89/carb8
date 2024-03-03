import {Body, Controller, Get, HttpException, Param, Post, Query, Redirect, Req, Res} from "@nestjs/common";
import {PaymentService} from "./payment.service";
import {Customer, Product} from "@prisma/client";

@Controller('payment')
export class PaymentController {

    constructor(
        private paymentService: PaymentService,
    ) {
    }

    @Post('order')
    createOrder(@Body() body:{ customer: Customer; products: Product[], foodTruckId: string, order: any }) {
        return this.paymentService.createOrder(body);
    }

    /**
     * This is the endpoint that is called by the payment provider
     * @param id - Order ID
     * @param res
     * @constructor - Redirects to the payment provider
     * @return {Promise<void>}
     */
    @Get('pay/:id')
    redirectToPayment(@Param('id') id: string) {
        return this.paymentService.redirectToPayment(id);
    }

    @Get('success')
    paymentSuccess(@Query() paymentResponse: any, @Res() res: any) {

        if (!paymentResponse || !paymentResponse.OrderID) {
            throw new HttpException('Invalid payment response', 400);
        }

        this.paymentService.paymentSuccess(paymentResponse).then((url: string) => {
            res.redirect(`${url}/${paymentResponse.OrderID}`);
        });
    }

    @Get('reject')
    paymentReject(@Query() paymentResponse: any, @Res() res: any) {
        if (!paymentResponse || !paymentResponse.OrderID) {
            throw new HttpException('Invalid payment response', 400);
        }
        this.paymentService.paymentReject(paymentResponse).then((url: string) => {
            res.redirect(`${url}/${paymentResponse.OrderID}`);
        });
    }

    @Get('notify')
    paymentNotify(@Query() paymentResponse: any) {
        if (!paymentResponse || !paymentResponse.OrderID) {
            throw new HttpException('Invalid payment response', 400);
        }
        this.paymentService.paymentNotify(paymentResponse);
    }

    @Post('pay')
    pay(@Body() body: { orderId: string }) {
        return this.paymentService.pay(body.orderId)
    }
}
