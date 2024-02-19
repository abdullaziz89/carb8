import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {CreateFoodTruckComponent} from "./create-food-truck/create-food-truck.component";
import { UpdateFoodTruckComponent } from "./update-food-truck/update-food-truck.component";
import { FoodTruckService } from "../services/food-truck.service";
import { FoodTruckDetailsComponent } from "./food-truck-details/food-truck-details.component";

@Component({
  selector: 'app-package',
  templateUrl: './food-truck.component.html',
  styleUrls: ['./food-truck.component.css']
})
export class FoodTruckComponent implements OnInit {

  foodTrucks: MatTableDataSource<any> | undefined;
  displayedColumns: string[] = ["no", "logo", "nameEng", "nameArb", "sportType", "numberOfViews", "enable", "actions"];

  constructor(
    private foodTruckService: FoodTruckService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.foodTruckService.findAll().subscribe((data: any) => {
      this.foodTrucks = new MatTableDataSource(data);
    });
  }

  createFoodTruck() {
    let dialog = this.dialog.open(CreateFoodTruckComponent, {
      width: "800px",
      data: { foodTrucks: this.foodTrucks?.data },
      panelClass: 'full-screen-dialog'
    });

    dialog.afterClosed().subscribe((result: any) => {
      this.ngOnInit();
    });
  }

  updateFoodTruck(pack: any) {
    let dialog = this.dialog.open(UpdateFoodTruckComponent, {
      width: "500px",
      data: { package: pack }
    });

    dialog.afterClosed().subscribe((result: any) => {
      this.ngOnInit();
    });
  }

  updateStatus(academy: any, matSlideToggleChange: any) {
    this.foodTruckService.updateStatus(academy.id, matSlideToggleChange.checked).subscribe((data: any) => {
      if (data) {
        academy.enable = matSlideToggleChange.checked;
      }
    });
  }

  openDetails(element: any) {
    this.dialog.open(FoodTruckDetailsComponent, {
      width: "800px",
      height: "600px",
      data: { academy: element }
    });
  }

  deleteFoodTruck(element: any) {
    this.foodTruckService.delete(element.id).subscribe((data: any) => {
      if (data) {
        this.ngOnInit();
      }
    });
  }

  getLogo(element: any) {
    return element.images.find((image: any) => {
      const split = image.split("/");
      return split[split.length - 1].split(".")[0] === "logo";
    });
  }
}
