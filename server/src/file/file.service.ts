import { Injectable } from "@nestjs/common";
import axios from "axios";
import FormData = require("form-data");

@Injectable()
export class FileService {

  apiKey = "rYAYR7h_6geIanjjIZWQ8mgTg6x6auTLxb0Vp4io"; // Replace with your Cloudflare API key
  url = `http://localhost:8082`;

  constructor() {
  }

  async uploadFile(file: any, dynamicDestination: string) {

    const formData = new FormData();
    formData.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype
    });
    formData.append("path", dynamicDestination);

    const response = await axios.post(`${this.url}/upload`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    return response.data.map(i => this.getFileUrl(dynamicDestination, i));
  }

  // upload multiple files
  async uploadFiles(files: any, dynamicDestination: string) {

    const formData = new FormData();
    files.forEach((file: any) => {
      formData.append("files", file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype
      });
    });
    formData.append("path", dynamicDestination);

    const response = await axios.post(`${this.url}/upload/multiple`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    return response.data.map(i => this.getFileUrl(dynamicDestination, i));
  }

  async getFiles(directory: string, id: string) {
    const response = await axios.get(`${this.url}/${directory}/${id}`);
    return response.data;
  }

  async deleteDirectory(directory: string, id: string) {

    let url = `${this.url}/${directory}/${id}`;
    const response = await axios.delete(url);
    return response.data;
  }

  async deleteFile(directory: string, id: string, filename: string) {
    let url = `${this.url}/${directory}/${id}/${filename}`;
    const response = await axios.delete(url);
    return response.data;
  }

  getFileUrl(path: string, filename: string) {
    return `https://file.kwfts.com/${path}/${filename}`;
  }
}
