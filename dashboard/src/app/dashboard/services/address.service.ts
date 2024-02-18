import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AddressService {

  apiUrl = `${environment.apiUrl}/address`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  // find for academy
  findForAcademy(academyId: any) {
    return this.httpClient.get(`${this.apiUrl}/academy/${academyId}`);
  }

  // update
  update(data: any): Observable<any> {
    return this.httpClient.patch<any>(`${this.apiUrl}`, data);
  }

  // delete
  delete(id: any) {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }
}
