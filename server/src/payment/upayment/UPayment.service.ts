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

        const isMainIban = this.configService.get("MAIN_IBAN") === foodTruckDetails.iban;

        let returnObj  = {
            products: products.map(product => ({
                name: product.name,
                description: product.description, // No equivalent field in the existing data
                price: product.price,
                quantity: product.quantity
            })),
            order: {
                id: order.id,
                reference: order.id, // Assuming order.id is equivalent to reference
                description: "", // No equivalent field in the existing data
                currency: "KWD", // Hardcoded as in the existing data
                amount: order.totalPrice
            },
            language: "en", // Hardcoded as there's no equivalent field in the existing data
            reference: {
                id: order.id // Assuming order.id is equivalent to reference id
            },
            customer: {
                uniqueId: customer.id,
                mobile: customer.phone
            },
            returnUrl: this.paymentObj.success_url,
            cancelUrl: this.paymentObj.error_url,
            notificationUrl: this.paymentObj.notifyURL,
            customerExtraData: order.foodTruck.id, // No equivalent field in the existing data
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
