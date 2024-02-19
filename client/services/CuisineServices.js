import axios from "axios";
import {environment} from "../config/env";
import APIClient from "../config/axios";

const apiUrl = `${environment.apiUrl}/cuisine`;

export const getCuisine = async () => {
  const response = await APIClient.get(`${apiUrl}/enabled`)
  return response.data;
}

export const updateCuisineView = async (id) => {
    const response = await APIClient.patch(`${apiUrl}/view/${id}`);
    return response.data;
}
