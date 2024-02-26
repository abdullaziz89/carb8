import {Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {GoogleOauthGuard} from "../guards/google-oauth.guard";
import {whiteLabel} from "./WhiteLabel";
import { ApiTags } from "@nestjs/swagger";
import { User } from "@prisma/client";

@ApiTags('authenticate')
@Controller('authenticate')
export class AuthController {

    /**
     * AuthController constructor
     * @param authService
     */
    constructor(private authService: AuthService) {
    }

    /**
     * Register a new user
     * @returns Promise<User>
     * @param body
     */
    @Post('register')
    async register(@Body() body: { user: User, roleId: string }) {
        return await this.authService.register(body.user, body.roleId);
    }

    /**
     * Login with credentials
     * @param body - username and password
     * @param req - request
     * @param res - response
     * @return Promise<{accessToken: string}>
     */
    @Post('login')
    async login(@Body() body, @Req() req, @Res() res: any) {

        // check later about the white label
        if (!whiteLabel.dashboard.some((item) => item === req.headers.host)) {
            await this.authService.checkUserRole(body.username).then((role) => {
                if (role.some((item) => item.role.name === 'CLIENT')) {

                    return new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
                }
            });
        }

        const response = await this.authService.loginWithCredentials(body);

        return res.status(HttpStatus.OK).json(response);
    }

    /**
     * Login with Google
     * @return Promise<{accessToken: string}>
     */
    @Get('google')
    @UseGuards(GoogleOauthGuard)
    async auth() {
    }

    /**
     * Callback for Google
     * @param req - request
     * @param res - response
     * @return Promise<{accessToken: string}>
     */
    @Get('google/callback')
    @UseGuards(GoogleOauthGuard)
    async googleAuthCallback(@Req() req, @Res({passthrough: true}) res: any) {
        const token = await this.authService.loginWithProvider(req.user, 'google');

        res.cookie('access_token', token, {
            maxAge: 2592000000,
            sameSite: true,
            secure: false,
        });

        return res.status(HttpStatus.OK).redirect('http://localhost:3001');
    }

    @Post('verify')
    async verify(@Body() body) {
        return this.authService.verifyEmail(body.otp, body.email);
    }

    @Post('send-otp')
    async sendOTP(@Body() body) {
        return this.authService.sendOTPEmail(body.email);
    }
}
