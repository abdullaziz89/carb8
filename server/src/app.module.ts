import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import {RoleModule} from './role/role.module';
import {RoleService} from "./role/role.service";
import {PrismaService} from "./prisma/prisma.service";
import {GovernorateModule} from './governorate/governorate.module';
import {AddressModule} from './address/address.module';
import {CuisineModule} from './cuisine/cuisine.module';
import {FoodTruckModule} from './foodTruck/foodTruck.module';
import {FileModule} from "./file/file.module";
import {HeaderImageModule} from "./header-image/header-image.module";
import {FoodTruckService} from "./foodTruck/foodTruck.service";
import {FileService} from "./file/file.service";
import {EventModule} from './event/event.module';
import {MailModule} from './mail/mail.module';
import {ConfigModule} from "@nestjs/config";
import {DeviceModule} from './device/device.module';
import {VoucherModule} from './voucher/voucher.module';
import {PaymentModule} from './payment/payment.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        RoleModule,
        GovernorateModule,
        AddressModule,
        CuisineModule,
        FoodTruckModule,
        FileModule,
        HeaderImageModule,
        EventModule,
        MailModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DeviceModule,
        VoucherModule,
        PaymentModule,
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService, RoleService, FoodTruckService, FileService],
})
export class AppModule {
}
