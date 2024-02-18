import axios from "axios";
import {environment} from "../config/env";

const apiUrl = `${environment.apiUrl}/sport-type`;

export const getSportsTypes = async () => {
  const response = await axios.get(`${apiUrl}/enabled`)
  return response.data;
}

export const updateSportTypeView = async (id) => {
    const response = await axios.patch(`${apiUrl}/view/${id}`);
    return response.data;
}

export const getSportType = async (id) => {
    const response = await axios.get(`https://my-json-server.typicode.com/abdullaziz89/testing-json/sportsTypes/${id}`);
    return response.data;
}
