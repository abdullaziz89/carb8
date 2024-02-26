import {Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {AppService} from "./app.service";
import {ApiTags} from "@nestjs/swagger";
import {Roles} from "./role/role.decorator";
import {RolesGuard} from "./guards/roles-guard.guard";
import {MailService} from "./mail/mail.service";
import * as process from "process";

@ApiTags('App')
@Controller()
export class AppController {

    constructor(private appService: AppService, private mailService: MailService) {
    }

    /**
     * Get the status of the app
     * @return Promise<Stats>
     */
    @Get('stats')
    @Roles(['SUPER_ADMIN', 'ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    getStatus() {
        return this.appService.getStats();
    }
}
