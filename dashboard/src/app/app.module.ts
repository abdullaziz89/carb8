import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginModule } from "./login/login.module";
import { MaterialModule } from "./material/material.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoutingModule } from "./routing/routing.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { HttpInterceptorService } from "./config/http-interceptor.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LoginModule,
    MaterialModule,
    RoutingModule,
    DashboardModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
