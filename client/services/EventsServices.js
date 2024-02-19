import {environment} from "../config/env";
import axios from "axios";
import APIClient from "../config/axios";

const apiUrl = `${environment.apiUrl}/event`;

export const getEvent = async (id) => {
    const response = await APIClient.get(`${apiUrl}/${id}`, {
        timeout: 10000
    });
    return response.data;
}
