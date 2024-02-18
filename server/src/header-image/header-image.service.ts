import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {HeaderImage, HeaderImageType, LinkType} from "@prisma/client";
import { FileService } from "../file/file.service";

@Injectable()
export class HeaderImageService {

  constructor(
    private prismaService: PrismaService,
    private fileService: FileService
  ) {
  }

  async create(headerImage: any, files: any) {
    headerImage = JSON.parse(headerImage);
    const hi = await this.prismaService.headerImage.create({
      data: {...headerImage, linkType: LinkType[headerImage.linkType], type: HeaderImageType[headerImage.type]}
    });

    let images = [];
    if (files) {
      images = await this.fileService.uploadFiles(files, `headerImage/${hi.id}`);
    }

    return { ...hi, images };
  }

  async findAll() {
    const headerImages = await this.prismaService.headerImage.findMany();

    for (const headerImage of headerImages) {
      const image = await this.fileService.getFiles(`headerImage`, headerImage.id);
      headerImage.imageUrl = this.fileService.getFileUrl(`headerImage/${headerImage.id}`, image[0]);
    }

    return headerImages;
  }

  async findAllEnabled() {
    const headerImages = await this.prismaService.headerImage.findMany({
      where: {
        enable: true
      }
    });

    for (const headerImage of headerImages) {
      const image = await this.fileService.getFiles(`headerImage`, headerImage.id);
      headerImage.imageUrl = this.fileService.getFileUrl(`headerImage/${headerImage.id}`, image[0]);
    }

    return headerImages;
  }

  async findOne(id: string) {
    const headerImage = await this.prismaService.headerImage.findUnique({
      where: { id }
    });

    const image = await this.fileService.getFiles(`headerImage`, headerImage.id);
    headerImage.imageUrl = this.fileService.getFileUrl(`headerImage/${headerImage.id}`, image[0]);

    return headerImage;
  }

  async update(headerImage: HeaderImage, files: any) {
    const hi = await this.prismaService.headerImage.update({
      where: { id: headerImage.id },
      data: headerImage
    });

    let images = [];
    if (files) {
      await this.fileService.deleteDirectory(files, `headerImage/${headerImage.id}`);
      images = await this.fileService.uploadFiles(files, `headerImage/${headerImage.id}`);
      hi.imageUrl = this.fileService.getFileUrl(`headerImage/${headerImage.id}`, images[0]);
    }

    return { ...hi, images };
  }

  updateEnable(id: string, enable: boolean) {
    return this.prismaService.headerImage.update({
      where: { id },
      data: { enable }
    });
  }

  // number of clicks
  async updateClicks(id: string) {
    return this.prismaService.headerImage.update({
      where: { id },
      data: {
        numberOfClicks: {
          increment: 1
        }
      }
    });
  }

  async remove(id: string) {
    const headerImage = await this.prismaService.headerImage.findUnique({
      where: { id }
    });

    await this.fileService.deleteDirectory(null, `headerImage/${headerImage.id}`);

    return this.prismaService.headerImage.delete({
      where: { id }
    });
  }
}
