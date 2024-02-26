import { Injectable } from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";

@Injectable()
export class MailService {

    constructor(private mailerService: MailerService) {}

    sendEmailOTPCode(email: string, otp) {
        return this.mailerService.sendMail({
            to: email,
            subject: 'Kuwait Food Truck - OTP Code',
            template: 'email-otp-code',
            context: {
                otp: otp,
            },
        });
    }
}
