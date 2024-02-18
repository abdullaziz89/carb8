import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req} from "@nestjs/common";
import { RoleService } from './role.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from "./role.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles-guard.guard";
import { getUserFromHeader } from "../utils/tools";
import { JwtService } from "@nestjs/jwt";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Role')
@Controller('role')
export class RoleController {

  constructor(private readonly roleService: RoleService, private jwtService: JwtService) {}

  /**
   * Create a new role
   * @param createRoleDto - the role to create
   * @return Promise<Role>
   */
  @Post()
  // @Roles(['SUPER_ADMIN', "ADMIN"])
  // @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createRoleDto: any) {
    return this.roleService.create(createRoleDto);
  }

  /**
   * Find all roles
   * @param req - the request to get the user from header token
   * @return Promise<Role[]>
   */
  @Get()
  @Roles(['SUPER_ADMIN', 'ADMIN'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Request() req) {
    return this.roleService.findAll(req);
  }

  /**
   * Find all roles for a given user
   * @param req
   * @return Promise<Role[]>
   */
  @Get("/user")
  @Roles(['SUPER_ADMIN', 'ADMIN'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAllForUser(@Request() req) {
    return this.roleService.findAllForUser(getUserFromHeader(req, this.jwtService));
  }

  /**
   * Find a role by id
   * @param id - the id of the role to find
   * @return Promise<Role>
   */
  @Get(':id')
  @Roles(['SUPER_ADMIN'])
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  /**
   * Update a role
   * @param updateRoleDto
   * @return Promise<Role>
   */
  @Patch()
  @Roles(['SUPER_ADMIN'])
  @UseGuards(JwtAuthGuard)
  update(@Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(updateRoleDto);
  }

  /**
   * Update a role status
   * @param obj - the role id and the new enable value
   * @return Promise<Role>
   */
  @Patch('/enable')
  @Roles(['SUPER_ADMIN'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateEnable(@Body() obj: {roleId: string; enable: boolean}) {
    return this.roleService.updateEnable(obj);
  }

  /**
   * Delete a role
   * @param id - the id of the role to delete
   * @return Promise<Role>
   */
  @Delete(':id')
  @Roles(['SUPER_ADMIN'])
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
