import {environment} from "../config/env";
import APIClient from "../config/axios";

const apiUrl = `${environment.apiUrl}/order`;

export const fetchOrder = async (orderId) => {
    const response = await APIClient.get(`${apiUrl}/${orderId}`);
    return response.data;
}
