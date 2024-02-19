import axios from "axios";
import {environment} from "../config/env";
import APIClient from "../config/axios";

const apiUrl = `${environment.apiUrl}/header-image`;

export const getHeadersImages = async () => {

  // get with axios
  const response = await APIClient.get(`${apiUrl}/enabled`);
  return response.data;
}

export const getHeaderImage = async (id) => {
    const response = await APIClient.get(`${apiUrl}/${id}`);
    return response.data;
}

export const updateHeaderImageView = async (id) => {
    const response = await APIClient.patch(`${apiUrl}/view/${id}`);
    return response.data;
}
