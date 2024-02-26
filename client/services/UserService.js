import {environment} from "../config/env";
import APIClient from "../config/axios";

const apiUrl = `${environment.apiUrl}/authenticate`;

export const login = async (payload) => {
    return await APIClient.post(`${apiUrl}/login`, payload);
}