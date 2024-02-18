import {environment} from "../config/env";
import axios from "axios";

const apiUrl = `${environment.apiUrl}/event`;

export const getEvent = async (id) => {
    const response = await axios.get(`${apiUrl}/${id}`, {
        timeout: 10000
    });
    return response.data;
}
