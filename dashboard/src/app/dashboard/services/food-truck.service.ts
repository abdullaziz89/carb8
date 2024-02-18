import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class FoodTruckService {

  apiUrl = `${environment.apiUrl}/food-truck`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  findAll() {
    return this.httpClient.get(this.apiUrl);
  }

  create(data: any) {
    return this.httpClient.post(this.apiUrl, data);
  }

  update(data: any) {
    return this.httpClient.patch(`${this.apiUrl}`, data);
  }

  updateStatus(id: any, status: any) {
    return this.httpClient.patch(`${this.apiUrl}/status/${id}`, { status: status });
  }

  delete(id: any) {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }

  uploadImages(formData: FormData, id: string) {
    return this.httpClient.post(`${this.apiUrl}/images/${id}`, formData);
  }

  deleteImage(fileName: string, id: string) {
    return this.httpClient.delete(`${this.apiUrl}/image/${id}/${fileName}`);
  }
}
