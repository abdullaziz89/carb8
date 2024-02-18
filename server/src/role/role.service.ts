import {Injectable} from '@nestjs/common';
import {UpdateRoleDto} from './dto/update-role.dto';
import {PrismaService} from "../prisma/prisma.service";
import {v4 as uuid} from 'uuid';
import {Role} from "@prisma/client";
import {getUserFromHeader} from "../utils/tools";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class RoleService {

    constructor(private prismaService: PrismaService) {
    }

    /**
     * Create a new role
     * @param createRoleDto - the role to create
     * @return Promise<Role>
     */
    async create(createRoleDto: any) {
        createRoleDto.id = uuid();
        createRoleDto.name = createRoleDto.name.toUpperCase();
        return this.prismaService.role.create({
            data: createRoleDto
        });
    }

    /**
     * Find all roles
     * @param req - the request to get the user from header token
     * @return Promise<Role[]>
     */
    async findAll(req) {

        return this.prismaService.role.findMany();

        // check later
        // let user = getUserFromHeader(req, this.jwtService);
        // let roles =   this.prismaService.role.findMany();
        //
        // if (user.role.name === "SUPER_ADMIN") {
        //   return roles;
        // } else {
        //   return roles.filter(r => r.name !== "SUPER_ADMIN");
        // }
    }

    /**
     * Find all roles for a given user
     * @param user - the user to find roles for
     * @return Promise<Role[]>
     */
    async findAllForUser(user: any) {
        return this.prismaService.role.findMany({
            where: {
                userRole: {
                    some: {
                        id: user.id
                    }
                }
            }
        });
    }

    /**
     * Find a role by id
     * @param id - the id of the role to find
     * @return Promise<Role>
     */
    async findOne(id: string): Promise<Role | undefined> {
        return this.prismaService.role.findUnique({
            where: {
                id: id
            },
        })
    }

    async findUserRoles(userId: string): Promise<Role[]> {
        return this.prismaService.role.findMany({
            where: {
                userRole: {
                    some: {
                        id: userId
                    }
                }
            }
        });
    }

    /**
     * Update a role
     * @param updateRoleDto - the role to update
     * @return Promise<Role>
     */
    async update(updateRoleDto: UpdateRoleDto) {
        return this.prismaService.role.update({
            where: {
                id: updateRoleDto.id
            },
            data: {
                name: updateRoleDto.name,
                enable: updateRoleDto.enable,
            }
        })
    }

    /**
     * Remove a role
     * @param id - the id of the role to remove
     * @return Promise<Role>
     */
    remove(id: string) {
        return this.prismaService.role.delete({
            where: {
                id: id
            }
        });
    }

    /**
     * Update status of a role
     * @param obj - the object containing the role id and the enable value
     * @return Promise<Role>
     */
    updateEnable(obj: { roleId: string; enable: boolean }) {
        return this.prismaService.role.update({
            where: {
                id: obj.roleId
            },
            data: {
                enable: obj.enable
            }
        });
    }
}
