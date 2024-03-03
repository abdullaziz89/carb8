import {Module} from '@nestjs/common';
import {CustomerModule} from "./customer/customer.module";
import {HttpModule} from "@nestjs/axios";
import {PaymentStatusModule} from "./payment-status/payment-status.module";
import {PaymentController} from "./payment.controller";
import {FoodTruckController} from "../foodTruck/foodTruck.controller";
import {OrderController} from "./order/order.controller";
import {FoodTruckService} from "../foodTruck/foodTruck.service";
import {PrismaService} from "../prisma/prisma.service";
import {RoleService} from "../role/role.service";
import {UserService} from "../user/user.service";
import {AuthService} from "../auth/auth.service";
import {JwtService} from "@nestjs/jwt";
import {UPaymentService} from "./upayment/UPayment.service";
import {PaymentService} from "./payment.service";
import {PaymentStatusService} from "./payment-status/payment-status.service";
import {OrderService} from "./order/order.service";
import {ConfigModule} from "../config/config.module";
import {FileService} from "../file/file.service";
import {MailService} from "../mail/mail.service";

@Module({
    imports: [
        CustomerModule,
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
        ConfigModule.register({folder: './config'}),
        PaymentStatusModule,
    ],
    controllers: [
        FoodTruckController,
        PaymentController,
        OrderController
    ],
    providers: [
        FoodTruckService,
        PrismaService,
        RoleService,
        UserService,
        AuthService,
        JwtService,
        RoleService,
        UPaymentService,
        PaymentService,
        PaymentStatusService,
        OrderService,
        FileService,
        MailService
    ],
    exports: [
        UPaymentService
    ]
})
export class PaymentModule {
}
