import {Get, Injectable, UseGuards} from '@nestjs/common';
import {UserService} from "./user/user.service";
import {FoodTruckService} from "./foodTruck/foodTruck.service";

@Injectable()
export class AppService {
    constructor(private foodTruckService: FoodTruckService) {
    }

    /**
     * Get the status of the app
     * @returns Promise<{users: number, teams: number, tasks: tasks}> - the number of users, teams and tasks
     */
    async getStats() {
        return await Promise.all([this.foodTruckService.count()])
            .then(([academies]) => {
                return {academies: academies};
            });
    }
}
