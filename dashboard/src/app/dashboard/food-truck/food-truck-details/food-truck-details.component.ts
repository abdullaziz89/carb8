import {Component, ElementRef, Inject, ViewChild} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { UpdateInformationComponent } from "../update-information/update-information.component";
import { UpdateAddressComponent } from "../update-address/update-address.component";
import {FoodTruckService} from "../../services/food-truck.service";

@Component({
  selector: "app-academy-details",
  templateUrl: "./food-truck-details.component.html",
  styleUrls: ["./food-truck-details.component.css"]
})
export class FoodTruckDetailsComponent {

  @ViewChild("fileInput", { static: false }) fileInput: ElementRef | undefined;

  foodTruck: any = {};

  fileNames: string[] = [];
  private event: any;

  constructor(
    private dialogRef: MatDialogRef<FoodTruckDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { academy: any },
    private dialog: MatDialog,
    private academyService: FoodTruckService
  ) {
    console.log(this.data.academy);
    this.foodTruck = this.data.academy;
  }

  ngOnInit(): void {
  }

  editInformation(academyInfo: any) {
    this.dialog.open(UpdateInformationComponent, {
      data: {
        information: academyInfo
      }
    });
  }

  editAddress(address: any) {
    this.dialog.open(UpdateAddressComponent, {
      data: {
        address: address
      }
    });
  }

  getLogo() {
    return this.foodTruck.images.find((image: any) => {
      const split = image.split("/");
      return split[split.length - 1].split(".")[0] === "logo";
    });
  }

  filterLogo() {
    return this.foodTruck.images.filter((image: any) => {
      const split = image.split("/");
      return split[split.length - 1].split(".")[0] !== "logo";
    });
  }

  setFile(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileInputChange(fileInput: any, event: any) {
    this.event = event;

    for (let file of fileInput.files) {
      this.fileNames.push(file.name);
    }

    const formData = new FormData();
    const files = this.event.target.files;

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    this.academyService.uploadImages(formData, this.foodTruck.id).subscribe(
      (response: any) => {
        console.log(response);
        this.foodTruck.images = response;
      }
    );
  }

  deleteBannerImage(imageUrl: string) {

    const fileName = imageUrl.split("/")[imageUrl.split("/").length - 1];
    this.academyService.deleteImage(fileName, this.foodTruck.id).subscribe(
      (response: any) => {
        if (response) {
          this.foodTruck.images = this.foodTruck.images.filter((image: any) => image !== imageUrl);
        }
      }
    );
  }
}
