import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class GovernorateService {

  apiUrl = `${environment.apiUrl}/governorate`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  findAll(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.apiUrl);
  }

  create(data: any) {
    return this.httpClient.post(this.apiUrl, data);
  }

  update(data: any) {
    return this.httpClient.patch(`${this.apiUrl}`, data);
  }

  updateEnabled(id: any, enabled: boolean) {
    return this.httpClient.patch(`${this.apiUrl}/${id}/enabled`, { enabled: enabled });
  }

  delete(id: any) {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }
}
