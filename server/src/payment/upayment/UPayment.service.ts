import {Injectable} from "@nestjs/common";
import {Customer, Order, Product} from "@prisma/client";
import {catchError, map} from "rxjs";
import {PrismaService} from "../../prisma/prisma.service";
import {ConfigService} from "@nestjs/config";
import {HttpService} from "@nestjs/axios";

@Injectable()
export class UPaymentService {

    private paymentObj = {
        merchant_id: undefined,
        username: undefined,
        password: undefined,
        test_mode: undefined,
        api_key: undefined,
        error_url: undefined,
        success_url: undefined,
        notifyURL: undefined,
        whitelabled: 1,
        payment_gateway: "Knet"
    };

    constructor(
        private readonly httpService?: HttpService,
        private configService?: ConfigService,
        private readonly prismaService?: PrismaService
    ) {

        this.paymentObj.merchant_id = this.configService.get("UPAYMENT_MERCHANT_ID");
        this.paymentObj.username = this.configService.get("UPAYMENT_USERNAME");

        this.paymentObj.password = this.configService.get("UPAYMENT_PASSWORD");
        this.paymentObj.test_mode = this.configService.get("UPAYMENT_TEST_MODE");
        this.paymentObj.api_key = this.configService.get("UPAYMENT_API_KEY");

        this.paymentObj.error_url = this.configService.get("UPAYMENT_REDIRECT_REJECT");
        this.paymentObj.success_url = this.configService.get("UPAYMENT_REDIRECT_SUCCESS");
        this.paymentObj.notifyURL = this.configService.get("UPAYMENT_REDIRECT_NOTIFY");
    }

    createPayment(foodTruckDetails: {
        nameEng: string; iban: string; foodTruckInfo: { phoneNumber: string; }; User: { email: string; }
    }, order: Order, customer: Customer, products: Product[]) {
        ;
        const upaymentObj = this.generateUPaymentObj({
                iban: foodTruckDetails.iban,
                name: foodTruckDetails.nameEng,
                email: foodTruckDetails.User.email,
                phone: foodTruckDetails.foodTruckInfo.phoneNumber
            },
            order,
            products,
            customer
        );

        return this.httpService.post(this.configService.get("UPAYMENT_URL"), upaymentObj, {
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
                "x-Authorization": "hWFfEkzkYE1X691J4qmcuZHAoet7Ds7ADhL"
            }
        }).pipe(
            map(response => {
                    return response.data;
                }
            ),
            catchError(error => {
                console.log("error", error);
                return error;
            })
        );
    }

    private generateUPaymentObj = (
        foodTruckDetails: {
            iban: string,
            name: string,
            email: string,
            phone: string
        },
        order: any,
        products: any[],
        customer: any
    ) => {
        return {
            ...this.paymentObj,
            order_id: order.id,
            total_price: order.totalPrice,
            ProductTitle: foodTruckDetails.name,
            ProductName: products.map(product => product.name),
            ProductPrice: products.map(product => product.price),
            ProductQty: products.map(product => product.quantity),
            CurrencyCode: "KWD",
            CstFName: foodTruckDetails.name,
            CstEmail: foodTruckDetails.email,
            CstMobile: foodTruckDetails.phone,
            reference: order.id,
            ExtraMerchantsData: JSON.stringify({
                amounts: [order.totalPrice],
                charges: [0.250],
                chargeType: ["fixed"],
                cc_charges: [0.1],
                cc_chargeType: ["fixed"],
                ibans: [foodTruckDetails.iban]
            })
        };
    };
}
