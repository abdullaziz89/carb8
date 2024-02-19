import {environment} from "../config/env";
import APIClient from "../config/axios";

const apiUrl = `${environment.apiUrl}/food-truck`;

export const getFoodTrucks = async () => {
    const response = await APIClient.get(`${apiUrl}/enabled`);
    return response.data;
}

export const getFoodTruck = async (id) => {
    const response = await APIClient.get(`${apiUrl}/${id}`, {
        timeout: 10000
    });
    return response.data;
}

export const updateFoodTruckView = async (id) => {
    const response = await APIClient.patch(`${apiUrl}/view/${id}`);
    return response.data;
}
