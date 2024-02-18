import {Injectable} from "@nestjs/common";
import {Cuisine} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";
import {FileService} from "../file/file.service";

@Injectable()
export class CuisineService {


    constructor(
        private prismService: PrismaService,
        private fileService: FileService
    ) {
    }

    async create(cuisine: Cuisine, files: any[]) {



        const st = await this.prismService.$transaction(async (prisma) => {
            const sst = await this.prismService.cuisine.create({
                data: cuisine,
                include: {
                    cuisineView: true
                }
            });

            await this.prismService.cuisineView.create({
                data: {
                    views: 0,
                    cuisine: {
                        connect: {
                            id: sst.id
                        }
                    }
                }
            });

            return sst;
        })

        let image = null;
        if (files.length > 0) {
            // upload file to cloudflare
            for (const file in files) {
                image = await this.fileService.uploadFile(files[file], `cuisine/${st.id}`);
            }
        }

        return {...st, image: image[0]};
    }

    async findAll() {
        const cuisines = await this.prismService.cuisine.findMany({
            include: {
                cuisineView: true
            }
        });

        const cuisinesWithImage = [];
        for (const cuisine of cuisines) {
            const image = await this.fileService.getFiles("cuisine", cuisine.id);
            cuisinesWithImage.push({
                ...cuisine,
                image: this.fileService.getFileUrl(`cuisine/${cuisine.id}`, image[0])
            });
        }

        return cuisinesWithImage;

        // return this.prismService.cuisine.findMany();
    }

    async findAllEnabled() {
        const cuisines = await this.prismService.cuisine.findMany({
            where: {
                enable: true
            },
            include: {
                cuisineView: true
            },
            orderBy: {
                foodTruck: {
                    _count: "desc"
                }
            }
        });

        const cuisinesWithImage = [];
        for (const cuisine of cuisines) {
            const image = await this.fileService.getFiles("cuisine", cuisine.id);
            cuisinesWithImage.push({
                ...cuisine,
                image: this.fileService.getFileUrl(`cuisine/${cuisine.id}`, image[0])
            });
        }

        return cuisinesWithImage;
    }

    async findOne(id: string) {
        const cuisine = await this.prismService.cuisine.findUnique({
            where: {
                id: id
            },
            include: {
                cuisineView: true
            }
        });

        return {
            ...cuisine,
            image: this.fileService.getFiles("cuisine", cuisine.id)[0]
        };
    }

    async findByName(name: string) {
        const cuisine = await this.prismService.cuisine.findUnique({
            where: {
                nameEng: name
            },
            include: {
                cuisineView: true
            }
        });

        return {
            ...cuisine,
            image: this.fileService.getFiles("cuisine", cuisine.id)[0]
        };
    }

    async update(cuisine: Cuisine) {
        const st = await this.prismService.cuisine.update({
            data: cuisine,
            where: {
                id: cuisine.id
            }
        });

        return {
            ...st,
            image: this.fileService.getFiles("cuisine", cuisine.id)[0]
        };
    }

    // increment view count
    async updateViewCount(id: string) {
        return this.prismService.cuisineView.upsert({
            where: {
                cuisineId: id
            },
            update: {
                views: {
                    increment: 1
                }
            },
            create: {
                views: 1,
                cuisineId: id
            }
        });
    }

    async remove(id: string) {
        await this.prismService.cuisineView.delete({
            where: {
                cuisineId: id
            }
        });
        return this.prismService.cuisine.delete({
            where: {
                id: id
            }
        });
    }

    async updateImg(id: string, files) {

        const isDeleted = await this.fileService.deleteDirectory("cuisine", id);

        if (isDeleted) {
            const isUploaded = await this.fileService.uploadFile(files[0], `cuisine/${id}`);

            if (isUploaded.length > 0) {
                const images = isUploaded;
                images.map((image) => this.fileService.getFileUrl(`cuisine/${id}`, image));
                return !!images[0];
            } else {
                return isDeleted;
            }
        } else {
            return isDeleted;
        }
    }
}
