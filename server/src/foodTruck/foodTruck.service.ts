import {Injectable} from "@nestjs/common";
import {FoodTruck, Address} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";
import {FileService} from "../file/file.service";

@Injectable()
export class FoodTruckService {

    constructor(
        private prismaService: PrismaService,
        private fileService: FileService
    ) {
    }

    async create(payload: { foodTruck: FoodTruck, address: Address, information: any }, files: any) {

        payload.foodTruck = await this.prismaService.$transaction(async (prisma) => {
            const createFoodTruck = await prisma.foodTruck.create({
                data: payload.foodTruck
            });
            await prisma.address.create({
                data: {...payload.address, foodTruckId: createFoodTruck.id}
            });

            const {FoodTruckWorkingDay, ...information} = payload.information;

            const newInfo = await prisma.foodTruckInformation.create({
                data: {
                    ...information,
                    foodTruck: {
                        connect: {
                            id: createFoodTruck.id
                        }
                    },
                }
            });

            await prisma.foodTruckWorkingDay.createMany({
                data: FoodTruckWorkingDay.map((day: any) => {
                    return {
                        ...day,
                        foodTruckInfoId: newInfo.id
                    };
                })
            });

            await prisma.foodTruckView.create({
                data: {
                    foodTruck: {
                        connect: {
                            id: createFoodTruck.id
                        }
                    },
                    views: 0
                }
            });

            return createFoodTruck;
        });

        payload.foodTruck = await this.prismaService.foodTruck.findUnique({
            where: {id: payload.foodTruck.id},
            include: {address: true}
        });

        let images = [];
        if (files) {
            images = await this.fileService.uploadFiles(files, `foodTruck/${payload.foodTruck.id}`);
        }

        return {...payload, images};
    }

    async findAll() {
        const academies = await this.prismaService.foodTruck.findMany({
            include: {
                address: {
                    include: {
                        governorate: true
                    }
                },
                foodTruckInfo: true,
                Cuisine: true,
                foodTruckView: true
            }
        });

        const academiesWithImages = [];

        for (const foodTruck of academies) {
            let images = await this.fileService.getFiles("foodTruck", foodTruck.id);
            images = images.map(image => this.fileService.getFileUrl(`foodTruck/${foodTruck.id}`, image));
            academiesWithImages.push({
                ...foodTruck,
                images: images
            });
        }

        return academiesWithImages;
    }

    async findOne(id: string) {
        const foodTruck = await this.prismaService.foodTruck.findUnique({
            where: {id: id},
            include: {
                address: true,
                foodTruckInfo: true,
                Cuisine: true,
                foodTruckView: true
            }
        });

        let images = await this.fileService.getFiles("foodTruck", foodTruck.id);
        images = images.map(image => this.fileService.getFileUrl(`foodTruck/${foodTruck.id}`, image));

        let cuisineImage = await this.fileService.getFiles("cuisine", foodTruck.Cuisine.id);
        cuisineImage = this.fileService.getFileUrl(`cuisine/${foodTruck.Cuisine.id}`, cuisineImage[0]);
        const Cuisine = {...foodTruck.Cuisine, image: cuisineImage};

        return {
            ...foodTruck,
            Cuisine: Cuisine,
            images: images
        };
    }

    async update(foodTruck: FoodTruck) {
        const foodTruckUpdated = await this.prismaService.foodTruck.update({
            where: {id: foodTruck.id},
            data: foodTruck
        });

        return {
            ...foodTruckUpdated,
            images: await this.fileService.getFiles("foodTruck", foodTruck.id)
        };
    }

    async remove(id: string) {

        const deletedFoodTruck = await this.prismaService.foodTruck.delete({
            where: {id: id}
        });

        if (deletedFoodTruck) {
            await this.fileService.deleteDirectory("foodTruck", id);
        }

        return deletedFoodTruck;
    }

    async deleteImage(id: string, image: string) {
        const isDeleted = await this.fileService.deleteFile("foodTruck", id, image);
        return !!isDeleted;
    }

    async findAllEnabled() {
        const academies = await this.prismaService.foodTruck.findMany({
            where: {enable: true},
            include: {
                address: {
                    include: {
                        governorate: true
                    }
                },
                foodTruckInfo: true,
                Cuisine: true,
                foodTruckView: true
            }
        });

        const academiesWithImages = [];

        for (const foodTruck of academies) {
            let images = await this.fileService.getFiles("foodTruck", foodTruck.id);
            images = images.map(image => this.fileService.getFileUrl(`foodTruck/${foodTruck.id}`, image));
            academiesWithImages.push({
                ...foodTruck,
                images: images
            });
        }

        return academiesWithImages;
    }

    async updateStatus(id: string, status: boolean) {
        const isUpdated = await this.prismaService.foodTruck.update({
            where: {id: id},
            data: {enable: status}
        });

        return !!isUpdated;
    }

    async incrementView(id: string) {
        return this.prismaService.foodTruckView.upsert({
            where: {foodTruckId: id},
            update: {views: {increment: 1}},
            create: {foodTruckId: id, views: 1}
        });
    }

    // add images to foodTruck
    async addImages(id: string, files: any) {
        return await this.fileService.uploadFiles(files, `foodTruck/${id}`);
    }

    count() {
        return this.prismaService.foodTruck.count();
    }
}
