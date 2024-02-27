import {environment} from "../config/env";
import APIClient from "../config/axios";

const apiUrl = `${environment.apiUrl}/food-truck`;

export const registerFoodTruck = async (foodTruck) => {
    const response = await APIClient.post(`${apiUrl}/user`, foodTruck, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => {
            return foodTruck; // this is doing the trick
        },
    });
    return response.data;
};

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

export const updateFoodTruck = async (payload) => {
    const response = await APIClient.patch(`${apiUrl}/user/`, payload);
    return response.data;
}

export const updateLogo = async (formdata) => {
    const response = await APIClient.patch(`${apiUrl}/user/logo`, formdata, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => {
            return formdata; // this is doing the trick
        },
    });
    return response.data;
}

export const updateFoodTruckView = async (id) => {
    const response = await APIClient.patch(`${apiUrl}/view/${id}`);
    return response.data;
}

export const getFoodTruckViews = async (id) => {
    const response = await APIClient.get(`${apiUrl}/views/${id}`);
    return response.data;
}
