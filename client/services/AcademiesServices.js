import axios from "axios";
import {environment} from "../config/env";

const apiUrl = `${environment.apiUrl}/academy`;

export const getAcademies = async () => {
    const response = await axios.get(`${apiUrl}/enabled`);
    return response.data;
}

export const getAcademy = async (id) => {
    const response = await axios.get(`${apiUrl}/${id}`, {
        timeout: 10000
    });
    return response.data;
}

export const updateAcademyView = async (id) => {
    const response = await axios.patch(`${apiUrl}/view/${id}`);
    return response.data;
}
