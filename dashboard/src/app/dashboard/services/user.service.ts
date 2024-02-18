import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  api = `${environment.apiUrl}/user`;

  constructor(private httpClient: HttpClient) { }

  getAllUsers(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.api}/all`);
  }

  getUserById(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.api}/${id}`);
  }

  createUser(user: any): Observable<any> {
    return this.httpClient.post<any>(`${this.api}`, user);
  }

  updateUser(user: any): Observable<any> {
    return this.httpClient.put<any>(`${this.api}`, user);
  }

  updateEnable(obj: {userId: string, enable: boolean}): Observable<any> {
    return this.httpClient.patch<any>(`${this.api}/enable`, obj);
  }

  updateUserPassword(obj: {userId: string, newPassword: boolean}): Observable<any> {
    return this.httpClient.patch<any>(`${this.api}/update/password`, obj);
  }

  deleteUser(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.api}/${id}`);
  }
}
