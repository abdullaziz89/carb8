import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { AuthenticationUser } from "../model/AuthenticationUser";
import { TokenStorageService } from "../../config/token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private tokenService: TokenStorageService) {
  }

  login(authenticationUser: AuthenticationUser): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/authenticate/login`, authenticationUser,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
      }
    )
      .pipe(
        map((response) => {
            this.tokenService.saveToken(response.token);
            this.tokenService.saveUserRoles(response.roles);
            return response.httpStatus;
          }
        ),
        catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
