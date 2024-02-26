import {BadRequestException, HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "src/user/user.service";
import {RoleService} from "../role/role.service";
import {comparePasswords} from "../utils/bcrypt";
import {cleanObj, exclude, existsRecord, generateOTP} from "../utils/tools";
import {PrismaService} from "../prisma/prisma.service";
import {User} from "@prisma/client";
import {v4 as uuid} from "uuid";
import {MailService} from "../mail/mail.service";

@Injectable()
export class AuthService {

    constructor(
        private usersService: UserService,
        private jwtTokenService: JwtService,
        private roleService: RoleService,
        private prismaService: PrismaService,
        private mailService: MailService
    ) {
    }

    /**
     * Register a new user
     * @param user - the user to register
     * @param roleId - the role id
     * @returns Promise<User>
     */
    async register(user: User, roleId: string) {

        const role = await this.roleService.findOne(roleId);

        if (!role) {
            throw new HttpException("role not exist", HttpStatus.BAD_REQUEST);
        }

        if (await existsRecord(this.prismaService.user, {where: {email: user.email}})) {
            throw new HttpException("this email used by other user", HttpStatus.BAD_REQUEST);
        }

        const {createdDate, modifyDate, password, ...result} = await this.usersService.create({user: user, role: role});
        return cleanObj(result);
    }

    /**
     * Validate user credentials
     * @param username - username
     * @param password - password
     * @returns Promise<any>
     */
    async validateUserCredentials(username: string, password: string): Promise<any> {
        const user = await this.usersService.findOne(username);

        if (user && comparePasswords(password, user.password)) {
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    /**
     * Login with credentials
     * @param user - username and password
     * @returns Promise<{accessToken: string}>
     */
    async loginWithCredentials(user: any) {

        let payload = await this.validateUserCredentials(user.username, user.password);

        if (!payload) {
            throw new HttpException({message: "User not exist"}, HttpStatus.UNAUTHORIZED);
        }

        if (!payload.enable) {
            throw new HttpException({message: "user not enabled", enable: payload.enable, username: user.username}, HttpStatus.UNAUTHORIZED);
        }

        let roles = payload.userRole.map((item: any) => item.role.name);

        let tbr = {
            token: this.jwtTokenService.sign({username: user.username, id: payload.id, enable: payload.enable}),
            roles: roles,
            user: payload
        };

        return tbr;
    }

    /**
     * Login with provider
     * @param user - user object
     * @param provider - provider name
     * @returns Promise<{accessToken: string}>
     */
    async loginWithProvider(user, provider: string) {

        if (!user) {
            throw new BadRequestException("Unauthenticated");
        }

        let userExists = await this.usersService.findOne(user.email);

        if (!userExists) {
            user.enable = true;
            user.provider = provider;
            user.roleId = "16e59291-cca9-47f3-8f8e-6a068362a87b";
            // @ts-ignore
            userExists = await this.register(user);
        }

        return {
            access_token: this.jwtTokenService.sign(userExists)
        };
    }

    /**
     * Check user role
     * @param username - username
     * @returns Promise<Role>
     */
    async checkUserRole(username: string) {
        let findUserRoleByUsername = await this.usersService.findUserRoleByUsername(username);
        findUserRoleByUsername = exclude(findUserRoleByUsername, ["userId", "roleId", "createdDate", "modifyDate"])
        findUserRoleByUsername.forEach((item: any) => {
            item.role = exclude(item.role, ["createdDate", "modifyDate"])
        });
        return findUserRoleByUsername;
    }

    async sendOTPEmail(email: string) {

        // check email exist
        const user = await this.prismaService.user.findFirst({
            where: {
                email: email
            }
        });

        if (!user) {
            throw new HttpException("User not already exist", HttpStatus.BAD_REQUEST);
        }

        const otp = await this.prismaService.oTP.create({
            data: {
                id: uuid(),
                code: generateOTP(),
                email:email,
            }
        })

        await this.mailService.sendEmailOTPCode(email, otp.code);
    };

    async verifyEmail(otp: string, email: string) {

        // check email exist
        const user = await this.prismaService.user.findFirst({
            where: {
                email: email
            }
        });

        if (!user) {
            throw new HttpException("User not exist", HttpStatus.NOT_FOUND);
        }

        // find otp by email from oTP table
        const otpRecord = await this.prismaService.oTP.findFirst({
            where: {
                email: email,
                verified: false,
            }
        });

        if (!otpRecord) {
            throw new HttpException("OTP not exist", HttpStatus.NOT_FOUND);
        }

        if (otpRecord.code !== otp) {
            throw new HttpException("Invalid OTP", HttpStatus.BAD_REQUEST);
        }

        // update otp record to verified
        await this.prismaService.oTP.update({
            where: {
                id: otpRecord.id
            },
            data: {
                verified: true
            }
        });

        // update user to enable
        await this.prismaService.user.update({
            where: {
                email: email
            },
            data: {
                enable: true
            }
        });

        // delete all otp records for this email
        await this.prismaService.oTP.deleteMany({
            where: {
                email: email
            }
        });

        return true;
    }

}
