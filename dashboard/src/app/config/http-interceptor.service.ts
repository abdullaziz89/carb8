import { Injectable } from '@angular/core';
import { TokenStorageService } from "./token-storage.service";
import { Router } from "@angular/router";
import { HttpEvent, HttpHandler, HttpHeaders, HttpRequest, HttpResponse } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService {

  constructor(private token: TokenStorageService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.token.getToken();
    let authReq = req

    if (token != null) {
      authReq = req.clone({
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        })
      });
    }

    return next.handle(authReq)
      .pipe(
        map((event:HttpEvent<any>) => {
          if (event instanceof HttpResponse && event.status === 201) {
            this.router.navigateByUrl("/dashboard");
          }
          return event;
        }),
        catchError(error => {
          if (error.status === 401) {
            this.router.navigateByUrl("/login");
          }

          return throwError(error);
        }));
  }
}
