import {environment} from "../config/env";
import APIClient from "../config/axios";

const apiUrl = `${environment.apiUrl}/governorate`;

export const getGovernorate = async () => {
    const response = await APIClient.get(`${apiUrl}/enabled`)
    return response.data;
}
