import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  apiUrl = `${environment.apiUrl}/event`;

  constructor(
    private httpClient: HttpClient
  ) { }

  getAll() {
    return this.httpClient.get(this.apiUrl);
  }

  get(id: number) {
    return this.httpClient.get(`${this.apiUrl}/${id}`);
  }

  create(event: any) {
    return this.httpClient.post(this.apiUrl, event);
  }

  update(event: any) {
    return this.httpClient.patch(`${this.apiUrl}`, event);
  }

  delete(id: string) {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string, checked: boolean) {
    return this.httpClient.patch(`${this.apiUrl}/enable/${id}`, {status: checked});
  }
}
