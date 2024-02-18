import { NgModule } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';
import { MaterialModule } from "../material/material.module";
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { IndicatorComponent } from "./indicator/indicator.component";
import { UpdatePasswordComponent } from './user/update-password/update-password.component';
import { ReactiveFormsModule } from "@angular/forms";
import { CuisineComponent } from "./cuisine/cuisine.component";
import { CreateComponent } from "./role/create/create.component";
import { UpdateComponent } from "./role/update/update.component";
import { FoodTruckComponent } from "./food-truck/food-truck.component";
import { CreateFoodTruckComponent } from "./food-truck/create-food-truck/create-food-truck.component";
import { UpdateFoodTruckComponent } from "./food-truck/update-food-truck/update-food-truck.component";
import { CreateCuisineComponent } from "./cuisine/create-cuisine/create-cuisine.component";
import { UpdateCuisineComponent } from "./cuisine/update-cuisine/update-cuisine.component";
import { CuisineDetailsComponent } from "./cuisine/cuisine-details/cuisine-details.component";
import { GovernorateComponent } from "./governorate/governorate.component";
import { CreateGovernorateComponent } from "./governorate/create-governorate/create-governorate.component";
import { UpdateGovernorateComponent } from "./governorate/update-governorate/update-governorate.component";
import { CreateAddressComponent } from "./food-truck/create-address/create-address.component";
import { UpdateAddressComponent } from "./food-truck/update-address/update-address.component";
import { UpdateInformationComponent } from "./food-truck/update-information/update-information.component";
import { CreateInformationComponent } from "./food-truck/create-information/create-information.component";
import { FoodTruckDetailsComponent } from "./food-truck/food-truck-details/food-truck-details.component";
import { HeaderImagesComponent } from './header-images/header-images.component';
import { CreateHeaderImagesComponent } from './header-images/create-header-images/create-header-images.component';
import { EventsComponent } from './events/events.component';
import { CreateEventsComponent } from './events/create-events/create-events.component';
import { UpdateEventsComponent } from './events/update-events/update-events.component';

@NgModule({
  declarations: [
    DashboardComponent,
    RoleComponent,
    UserComponent,
    UserDetailsComponent,
    IndicatorComponent,
    UpdatePasswordComponent,
    CuisineComponent,
    CreateComponent,
    UpdateComponent,
    FoodTruckComponent,
    CreateFoodTruckComponent,
    UpdateFoodTruckComponent,
    CreateCuisineComponent,
    UpdateCuisineComponent,
    CuisineDetailsComponent,
    GovernorateComponent,
    CreateGovernorateComponent,
    UpdateGovernorateComponent,
    CreateAddressComponent,
    UpdateAddressComponent,
    UpdateInformationComponent,
    CreateInformationComponent,
    FoodTruckDetailsComponent,
    HeaderImagesComponent,
    CreateHeaderImagesComponent,
    EventsComponent,
    CreateEventsComponent,
    UpdateEventsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    NgOptimizedImage
  ],
    exports: [
        DashboardComponent,
        IndicatorComponent
    ]
})
export class DashboardModule { }
