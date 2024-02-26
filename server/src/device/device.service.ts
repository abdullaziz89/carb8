import {HttpException, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {DeviceType} from "@prisma/client";

@Injectable()
export class DeviceService {

    constructor(private prismaService: PrismaService) {
    }

    // get user devices
    async getDevices(userId: string) {
        return this.prismaService.device.findMany({
            where: {
                userId: userId
            }
        });
    }

    // create a new device for a user
    async createDevice(device: { deviceType: string, userId: string, token: string}) {

        device.deviceType = device.deviceType.toUpperCase();

        // check if the device type is valid
        if (!Object.values(DeviceType).includes(device.deviceType as DeviceType)) {
            throw new Error('Invalid device type');
        }

        return this.prismaService.device.create({
            data: {
                deviceType: device.deviceType as DeviceType,
                userId: device.userId,
                token: device.token,
            }
        });
    }

    // update a device
    async updateDevice(device: { id: string, deviceType: string, token: string}) {

        device.deviceType = device.deviceType.toUpperCase();

        // check if the device type is valid
        if (!Object.values(DeviceType).includes(device.deviceType as DeviceType)) {
            throw new Error('Invalid device type');
        }

        // check if the device exists
        const existingDevice = await this.prismaService.device.findUnique({
            where: {
                id: device.id
            }
        });

        if (!existingDevice) {
            throw new HttpException('Device not found', 404)
        }

        return this.prismaService.device.update({
            where: {
                id: device.id
            },
            data: {
                deviceType: device.deviceType as DeviceType,
                token: device.token,
            }
        });
    }

    // delete a device
    async deleteDevice(deviceId: string) {
        return this.prismaService.device.delete({
            where: {
                id: deviceId
            }
        });
    }
}
