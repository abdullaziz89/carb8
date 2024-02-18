import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  api = `${environment.apiUrl}/role`;

  constructor(private httpClient: HttpClient) { }

  getAllRoles(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.api}`);
  }

  getRoleById(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.api}/${id}`);
  }

  createRole(role: any): Observable<any> {
    return this.httpClient.post<any>(`${this.api}`, role);
  }

  updateRole(role: any): Observable<any> {
    return this.httpClient.patch<any>(`${this.api}/${role.id}`, role);
  }

  deleteRole(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.api}/delete/${id}`);
  }

  updateEnable(obj: {roleId: string; enable: boolean}) {
    return this.httpClient.patch<any>(`${this.api}/enable`, obj);
  }
}
