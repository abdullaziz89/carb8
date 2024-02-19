import axios from 'axios';
import {environment} from "./env";

const APIClient = () => {
    return axios.create({
        baseURL: `${environment.apiUrl}`
    });
}

export default APIClient();