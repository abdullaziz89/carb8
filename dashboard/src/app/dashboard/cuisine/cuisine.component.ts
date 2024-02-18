import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { CuisineService } from "../services/cuisine.service";
import { CreateCuisineComponent } from "./create-cuisine/create-cuisine.component";
import { UpdateCuisineComponent } from "./update-cuisine/update-cuisine.component";
import { Router } from "@angular/router";
import { HttpEventType, HttpResponse } from "@angular/common/http";

@Component({
  selector: "app-business",
  templateUrl: "./cuisine.component.html",
  styleUrls: ["./cuisine.component.css"]
})
export class CuisineComponent implements OnInit {

  cuisines: MatTableDataSource<any> | undefined;
  displayedColumns: string[] = ["no", "image", "nameEng", "nameArb", "numberOfViews", "enabled", "actions"];

  isLoading: boolean = false;

  constructor(
    private dialog: MatDialog,
    private cuisineService: CuisineService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.getAllData();
  }

  ngOnInit(): void {
  }

  getAllData() {
    this.cuisineService.findAll().subscribe((data: any) => {

      data.forEach((sportType: any, index: number) => {
        sportType.image = this.formatImageUrl(sportType.image);
      });
      this.cuisines = new MatTableDataSource<any>(data);
      this.cuisines._updateChangeSubscription();
    });
  }

  createCuisine() {
    let dialog = this.dialog.open(CreateCuisineComponent, {
      width: "500px",
      data: {
        cuisines: this.cuisines?.data
      }
    });

    dialog.afterClosed().subscribe((result: any) => {

      if (result) {
        if (this.cuisines) {
          this.cuisines.data.push(result);
          this.cuisines._updateChangeSubscription();
        }
      }
    });
  }

  updateCuisine(sportType: any) {
    let dialog = this.dialog.open(UpdateCuisineComponent, {
      width: "500px",
      data: {
        sportTypes: this.cuisines?.data,
        sportType: sportType
      }
    });

    dialog.afterClosed().subscribe((result: any) => {

      if (result) {
        let index = this.cuisines?.data.findIndex((sportType: any) => sportType.id === result.id);
        if (index !== undefined) {
          this.cuisines!.data[index] = result;
          this.cuisines?._updateChangeSubscription();
        }
      }
    });
  }


  changeImage($event: any, id: string) {

    const formData = new FormData();

    for (let file of $event.target.files) {
      formData.append("files", file);
    }

    formData.append("id", id);

    this.isLoading = true;
    this.cuisines = undefined;
    this.cuisineService.changeImg(formData).subscribe((event: any) => {
      this.getAllData();
      this.isLoading = false;
    });
  }

  onFileChange($event: Event, id: string) {
    this.changeImage($event, id);
  }

  clickInputFile(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  formatImageUrl(imageUrl: string) {
    return `${imageUrl}?last_open=${new Date().getTime()}`;
  }

  deleteCuisine(cuisine: any) {
    if (confirm("Are you sure you want to delete this cuisine?")) {
      this.cuisineService.delete(cuisine.id).subscribe((data: any) => {
        this.cuisines?.data.splice(this.cuisines?.data.indexOf(cuisine), 1);
        this.cuisines?._updateChangeSubscription();
      });
    }
  }
}
