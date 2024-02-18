import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {encodePassword} from "../utils/bcrypt";
import {v4 as uuid} from "uuid";
import {exclude, excludePasswords, getUserFromHeader} from "../utils/tools";
import {JwtService} from "@nestjs/jwt";
import {Role, User} from "@prisma/client";


@Injectable()
export class UserService {


    constructor(private prismaService: PrismaService, private readonly jwtService: JwtService) {
    }

    /**
     * Create a new user
     * @param obj - the user to create
     * @return Promise<User>
     */
    async create(obj: any) {
        const {user, role} = obj;
        user.id = uuid();
        return this.prismaService.user.create({
            data: {
                ...user,
                enable: true,
                password: encodePassword(user.password),
                userRole: {
                    create: {
                        role: {
                            connect: {
                                id: role.id
                            }
                        }
                    }
                }
            },
        });
    }

    /**
     * Find all users
     * @param username - the username to find
     * @return Promise<User[]>
     */
    async findOne(username: string): Promise<User | undefined> {

        let user = await this.prismaService.user.findUnique({
            where: {
                email: username
            },
            include: {
                userRole: {
                    include: {
                        role: true,
                    }
                }
            }
        });


        // if user not exist
        if (!user) {
            return undefined;
        }

        user.userRole = exclude(user.userRole, ["userId", "roleId", "createdDate", "modifyDate"])

        user.userRole.forEach((userRoleTeam) => {
            userRoleTeam.role = exclude(userRoleTeam.role, ["enable", "createdDate", "modifyDate"]);
        });

        return user;
    }

    /**
     * Find a user by id
     * @param id - the id of the user to find
     * @return Promise<User>
     */
    async findOneById(id: string): Promise<User | undefined> {
        let user = await this.prismaService.user.findUnique({
            where: {
                id: id
            },
            include: {
                userRole: {
                    include: {
                        role: true,
                    }
                }
            }
        });

        return exclude(user, ["password"]);
    }

    /**
     * Find a user by id
     * @param user - the user to update
     * @return Promise<User>
     */
    async update(user: any): Promise<User | undefined> {
        return this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                email: user.email,
                name: user.name
            }
        });
    }

    /**
     * Find a user by id
     * @param obj - the user to update
     * @return Promise<User>
     */
    async updateEnable(obj: { userId: string, enable: boolean }): Promise<boolean | undefined> {
        const {enable} = await this.prismaService.user.update({
            where: {
                id: obj.userId
            },
            data: {
                enable: obj.enable,
            }
        });
        return enable;
    }

    /**
     * Find a user by id
     * @param user - the user to update
     * @param password - the old password
     * @param newPassword - the new password to update
     * @return Promise<User>
     */
    async updatePassword(user: any, password: string, newPassword: string): Promise<User | undefined> {

        const userFound = await this.prismaService.user.findUnique({
            where: {
                id: user.id
            }
        });

        if (userFound && userFound.password === encodePassword(password)) {
            return this.prismaService.user.update({
                where: {
                    id: user.id
                },
                data: {
                    password: encodePassword(newPassword)
                }
            });
        } else {
            throw new UnauthorizedException("Invalid password");
        }
    }

    /**
     * update user password from admin
     * @param userId - the user id
     * @param newPassword - the new password to update
     * @return Promise<User>
     */
    async updateUserPassword(userId: any, newPassword: string): Promise<User | undefined> {

        const userFound = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        });

        if (userFound) {
            return this.prismaService.user.update({
                where: {
                    id: userId
                },
                data: {
                    password: encodePassword(newPassword)
                }
            });
        } else {
            throw new UnauthorizedException("Invalid password");
        }
    }

    /**
     * Find All users
     * @param req - the request
     * @return Promise<User[]>
     */
    async getAll(req: any): Promise<User[]> {
        let user = getUserFromHeader(req, this.jwtService);
        let users = await this.prismaService.user.findMany({
            include: {
                userRole: {
                    include: {
                        role: true,
                    }
                }
            }
        });

        let usersNoPass = excludePasswords(users, ["password"]);
        if (user.user === "SUPER_ADMIN") {
            return usersNoPass;
        } else {
            return usersNoPass.filter(u => u.userRole.name !== "SUPER_ADMIN");
        }
    }

    /**
     * count users
     * @return Promise<number>
     */
    async count() {
        return this.prismaService.user.count();
    }

    /**
     * find user role by user id
     * @param userId - the user id
     * @return Promise<userRole[]>
     */
    async findUserRole(userId: string) {
        return this.prismaService.userRole.findMany({
            where: {
                userId: userId
            },
            include: {
                role: true
            }
        });
    }

    /**
     * find user role by user name
     * @param username - the user name
     * @return Promise<userRole[]>
     */
    async findUserRoleByUsername(username: string) {
        return this.prismaService.userRole.findMany({
            where: {
                user: {
                    email: username
                }
            },
            include: {
                role: true
            }
        });
    }
}
