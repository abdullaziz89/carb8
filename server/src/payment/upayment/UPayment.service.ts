import {Injectable} from "@nestjs/common";
import {Customer, Order, Product} from "@prisma/client";
import {catchError, lastValueFrom, map} from "rxjs";
import {PrismaService} from "../../prisma/prisma.service";
import {HttpService} from "@nestjs/axios";
import {isAxiosError} from "axios";
import {ConfigService} from "../../config/config.service";

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

    createPayment(
        foodTruckDetails: {
            nameEng: string;
            iban: string;
            foodTruckInfo: { phoneNumber: string; };
        },
        order: Order,
        customer: Customer,
        products: Product[]
    ) {

        console.log("foodTruckDetails", foodTruckDetails);
        const upaymentObj = this.generateUPaymentObj({
                iban: foodTruckDetails.iban,
                name: foodTruckDetails.nameEng,
                phone: foodTruckDetails.foodTruckInfo.phoneNumber
            },
            order,
            products,
            customer
        );

        return lastValueFrom(this.httpService.post(`${this.configService.get("UPAYMENT_URL")}/charge`, upaymentObj, {
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.paymentObj.api_key}`,
                "accept": "application/json"
            }
        }).pipe(
            map(response => response.data),
            catchError(e => {
                if (isAxiosError(e)) {
                    console.log(e);
                } else {
                    console.log(e);
                }
                return e;
            })
        ));
    }

    getGatewayStatus(id: string) {
        return lastValueFrom(this.httpService.get(`${this.configService.get("UPAYMENT_URL")}/get-payment-status/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.paymentObj.api_key}`,
            }
        }).pipe(
            map(response => response.data),
            catchError(e => {
                if (isAxiosError(e)) {
                    console.log(e);
                } else {
                    console.log(e);
                }
                return e;
            })
        ));
    }

    private generateUPaymentObj = (
        foodTruckDetails: {
            iban: string,
            name: string,
            phone: string
        },
        order: any,
        products: any[],
        customer: any
    ) => {

        const isMainIban = this.configService.get("MAIN_IBAN") === foodTruckDetails.iban || !foodTruckDetails.iban;

        let returnObj = {
            products: products.map(product => ({
                name: product.name,
                description: product.description, // No equivalent field in the existing data
                price: product.price,
                quantity: product.quantity
            })),
            order: {
                id: order.id,
                reference: order.id,
                description: `order from ${foodTruckDetails.name} food truck, order id: ${order.id}, customer: ${customer.phone}`,
                currency: "KWD",
                amount: order.totalPrice,
            },
            reference: {
                id: `${foodTruckDetails.phone}-${customer.phone}-${new Date().getTime()}`,
            },
            paymentGateway: {
                src: order.invoice.Payment[0].method,
            },
            language: "en",
            returnUrl: this.paymentObj.success_url,
            cancelUrl: this.paymentObj.error_url,
            notificationUrl: this.paymentObj.notifyURL,
            customerExtraData: order.FoodTurck.id, // No equivalent field in the existing data
        };

        if (!isMainIban) {
            return {
                ...returnObj,
                extraMerchantData: [{
                    amount: order.totalPrice,
                    knetCharge: 0.250, // Hardcoded as in the existing data
                    knetChargeType: "fixed", // Hardcoded as in the existing data
                    ccCharge: 3.0, // Hardcoded as in the existing data
                    ccChargeType: "percentage", // Hardcoded as in the existing data
                    ibanNumber: foodTruckDetails.iban
                }]
            }
        } else {
            return returnObj
        }
    };
}
