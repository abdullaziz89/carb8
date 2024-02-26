import {environment} from "../config/env";
import APIClient from "../config/axios";

const apiUrl = `${environment.apiUrl}/authenticate`;

export const sendOTP = async (payload) => {
    const response = await APIClient.post(`${apiUrl}/send-otp`, payload);
    return response.data;
}

export const OTPVerify = async (payload) => {
    const response = await APIClient.post(`${apiUrl}/verify`, payload);
    return response.data;
}
