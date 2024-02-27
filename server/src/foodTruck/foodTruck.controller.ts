import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
    UploadedFiles
} from "@nestjs/common";
import {FoodTruckService} from "./foodTruck.service";
import {FoodTruck, FoodTruckInformation, Address} from "@prisma/client";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {RolesGuard} from "../guards/roles-guard.guard";
import {Roles} from "../role/role.decorator";
import {CloudflareImagesInterceptor} from "../file/CloudflareImagesInterceptor";

@Controller("food-truck")
export class FoodTruckController {
    constructor(private readonly foodTruckService: FoodTruckService) {
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(["SUPER_ADMIN", "ADMIN"])
    @UseInterceptors(CloudflareImagesInterceptor)
    create(@Body("payload") payload: any, @UploadedFiles() files: any) {
        return this.foodTruckService.create(JSON.parse(payload), files);
    }

    @Post('user')
    createWithUser(@Body("payload") payload: any, @UploadedFiles() files: any) {
        return this.foodTruckService.create(JSON.parse(payload), files);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(["SUPER_ADMIN", "ADMIN"])
    findAll() {
        return this.foodTruckService.findAll();
    }

    @Get('enabled')
    findAllEnabled() {
        return this.foodTruckService.findAllEnabled();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.foodTruckService.findOne(id);
    }

    @Get("views/:id")
    getViews(@Param("id") id: string) {
        return this.foodTruckService.getFoodTruckViews(id);
    }

    @Patch()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(["SUPER_ADMIN", "ADMIN"])
    update(@Body() foodTruck: FoodTruck) {
        return this.foodTruckService.update(foodTruck);
    }

    @Patch('user')
    updateWithUser(@Body() payload: {foodTruck: FoodTruck, user: {id: string, email: string}}) {
        return this.foodTruckService.updateWithUser(payload);
    }

    @Patch("user/logo")
    updateLogo(@Body() payload: { id: string, logo: string }, @UploadedFiles() files: any) {
        return this.foodTruckService.updateLogo(payload.id, files);
    }

    @Patch("status/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(["SUPER_ADMIN", "ADMIN"])
    updateStatus(@Param("id") id: string, @Body() payload: { status: boolean }) {
        return this.foodTruckService.updateStatus(id, payload.status);
    }

    @Patch("view/:id")
    updateViews(@Param("id") id: string) {
        return this.foodTruckService.incrementView(id);
    }

    @Delete("image/:id/:imageName")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(["SUPER_ADMIN", "ADMIN"])
    removeImage(@Param("id") id: string, @Param("imageName") imageName: string) {
        return this.foodTruckService.deleteImage(id, imageName);
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(["SUPER_ADMIN", "ADMIN"])
    remove(@Param("id") id: string) {
        return this.foodTruckService.remove(id);
    }

    @Post("images/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(["SUPER_ADMIN", "ADMIN"])
    @UseInterceptors(CloudflareImagesInterceptor)
    uploadFoodTruckImages(@Param("id") id: string, @UploadedFiles() files: any) {
        return this.foodTruckService.addImages(id, files);
    }
}
