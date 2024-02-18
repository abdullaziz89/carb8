import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  numberOfFoodTrucks: number = 0;

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {

    this.httpClient.get(environment.apiUrl + '/stats').subscribe((res: any) => {
      this.numberOfFoodTrucks = res.academies;
    });
  }
}
