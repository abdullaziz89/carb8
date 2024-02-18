import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class FoodTruckInformationService {

  apiUrl = `${environment.apiUrl}/food-truck/information`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  // find for academy
  findForAcademy(academyId: any) {
    return this.httpClient.get(`${this.apiUrl}/food-truck/${academyId}`);
  }

  // update
  update(data: any) {
    return this.httpClient.patch(`${this.apiUrl}`, data);
  }

  // delete
  delete(id: any) {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }
}
