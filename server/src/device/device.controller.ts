import { Controller } from '@nestjs/common';
import {DeviceService} from "./device.service";

@Controller('device')
export class DeviceController {

    constructor(private deviceService: DeviceService) {
    }

    // get user devices
    async getDevices(userId: string) {
        return this.deviceService.getDevices(userId);
    }

    // create a new device for a user
    async createDevice(device: { deviceType: string, userId: string, token: string}) {
        return this.deviceService.createDevice(device);
    }

    // update a device
    async updateDevice(device: { id: string, deviceType: string, token: string}) {
        return this.deviceService.updateDevice(device);
    }

    // delete a device
    async deleteDevice(deviceId: string) {
        return this.deviceService.deleteDevice(deviceId);
    }
}
