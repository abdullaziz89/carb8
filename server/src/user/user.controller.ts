import { Body, Controller, Get, Param, Patch, Request, UseGuards } from "@nestjs/common";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "./user.service";
import { Roles } from "../role/role.decorator";
import { RolesGuard } from "../guards/roles-guard.guard";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('User')
@Controller("user")
export class UserController {

    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) {}

    /**
     * Get all users
     * @param req - the request
     * @return Promise<User[]>
     */
    @Get("all")
    @Roles(['SUPER_ADMIN', 'ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    getAll(@Request() req) {
        return this.userService.getAll(req);
    }

    /**
     * Get a user by id
     * @param id - the id of the user to find
     * @return Promise<User>
     */
    @Get("/:id")
    @UseGuards(JwtAuthGuard)
    getUser(@Param("id") id: string) {
        return this.userService.findOneById(id);
    }

    /**
     * Get the user info from the header
     * @param req - the request
     * @return Promise<User>
     */
    @Get("info")
    @UseGuards(JwtAuthGuard)
    getUserInfo(@Request() req) {
        return this.getUserFromHeader(req);
    }

    /**
     * Update a user
     * @param user - the user to update
     * @param req - the request to get the user id from the header token
     */
    @Patch()
    @UseGuards(JwtAuthGuard)
    update(@Body() user: any, @Request() req) {
        user.id = this.getUserFromHeader(req).id;
        return this.userService.update(user);
    }

    /**
     * Update a user
     * @param obj: {userId: string, enable: string} - the userId to update the status and the new status
     * @return Promise<User>
     */
    @Patch('/enable')
    @Roles(['SUPER_ADMIN', 'ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    updateEnable(@Body() obj: { userId: string, enable: boolean }) {
        return this.userService.updateEnable(obj);
    }

    /**
     * Update a user
     * @param body - the body to update the user
     * @param req - the request to get the user id from the header token
     * @return Promise<User>
     */
    @Patch('/password')
    @UseGuards(JwtAuthGuard)
    updatePassword(@Body() body: {password: string, newPassword: string}, @Request() req) {
        let user = this.getUserFromHeader(req);
        return this.userService.updatePassword(user.id, body.password, body.newPassword);
    }

    /**
     * Update a user
     * @param body - the body to update the user
     * @param req - the request to get the user id from the header token
     * @return Promise<User>
     */
    @Patch('/update/password')
    @Roles(['SUPER_ADMIN', 'ADMIN'])
    @UseGuards(JwtAuthGuard, RolesGuard)
    updateUserPassword(@Body() body: {userId: string, newPassword: string}, @Request() req) {
        return this.userService.updateUserPassword(body.userId, body.newPassword);
    }

    /**
     * Get the user from the header
     * @param req - the request
     * @private
     * @return User
     */
    private getUserFromHeader(req: any) {
        const {
            createdDate,
            modifyDate,
            iat,
            exp,
            ...result
        } = this.jwtService.decode(req.headers.authorization.split(" ")[1]) as any;
        return result;
    }
}
