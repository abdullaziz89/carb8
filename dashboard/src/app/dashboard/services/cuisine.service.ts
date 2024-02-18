import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import * as constants from "constants";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CuisineService {

  apiUrl = `${environment.apiUrl}/cuisine`;

  constructor(
    private httpClient: HttpClient,
  ) { }

  findAll() {
    return this.httpClient.get(`${this.apiUrl}`);
  }

  findOne(id: string) {
    return this.httpClient.get(`${this.apiUrl}/${id}`);
  }

  create(formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}`, formData, { reportProgress: true, observe: "events" });
  }

  update(sportType: any) {
    return this.httpClient.patch(`${this.apiUrl}`, sportType);
  }

  delete(id: string) {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }

  changeImg(formData: FormData): Observable<any> {
    return this.httpClient.patch<string>(`${this.apiUrl}/image`, formData);
  }
}
