import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HeaderImagesService {

  apiUrl = `${environment.apiUrl}/header-image`

  constructor(
    private httpClient: HttpClient,
  ) { }

  findAll() {
    return this.httpClient.get(`${this.apiUrl}`);
  }

  create(formData: FormData) {
    return this.httpClient.post(`${this.apiUrl}`, formData);
  }

  remove(id: string) {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }
}
