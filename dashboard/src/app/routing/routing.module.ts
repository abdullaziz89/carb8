import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "../login/login/login.component";
import { DashboardComponent } from "../dashboard/dashboard/dashboard.component";
import { UserComponent } from "../dashboard/user/user.component";
import { RoleComponent } from "../dashboard/role/role.component";
import { UserDetailsComponent } from "../dashboard/user/user-details/user-details.component";
import {FoodTruckComponent} from "../dashboard/food-truck/food-truck.component";
import { CuisineComponent } from "../dashboard/cuisine/cuisine.component";
import { GovernorateComponent } from "../dashboard/governorate/governorate.component";
import {EventsComponent} from "../dashboard/events/events.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "login", component: LoginComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "users", component: UserComponent },
  { path: "roles", component: RoleComponent },
  { path: "user/:id", component: UserDetailsComponent },
  { path: "cuisine", component: CuisineComponent },
  { path: "food-truck", component: FoodTruckComponent },
  { path: "events", component: EventsComponent },
  { path: "governorate", component: GovernorateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }
