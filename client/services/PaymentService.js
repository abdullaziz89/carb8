import {environment} from "../config/env";
import APIClient from "../config/axios";

const apiUrl = `${environment.apiUrl}/payment`;

export const createOrder = async (payload) => {
    const response = await APIClient.post(`${apiUrl}/order`, payload);
    return response.data;
}

export const payOrder = async (orderId) => {
    const response = await APIClient.post(`${apiUrl}/pay`, {orderId});
    return response.data;
}