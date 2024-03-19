import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FoodTruckService } from "../../services/food-truck.service";
import { CuisineService } from "../../services/cuisine.service";
import { GovernorateService } from "../../services/governorate.service";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-create-package",
  templateUrl: "./create-food-truck.component.html",
  styleUrls: ["./create-food-truck.component.css"]
})
export class CreateFoodTruckComponent implements OnInit {

  @ViewChild("fileInput", { static: false }) fileInput: ElementRef | undefined;

  foodTruckFormGroup: FormGroup;

  foodTruckForm: FormGroup;
  addressForm: FormGroup;
  informationForm: FormGroup;

  cuisines: any[] = [];
  governorates: any[] = [];

  isLoading: boolean = false;

  progress: { percentage: number } = { percentage: 0 };
  showProgress: boolean = false;
  fileName = "";
  private event: any;

  constructor(
    private dialogRef: MatDialogRef<CreateFoodTruckComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { foodTrucks: any[] },
    private foodTruckService: FoodTruckService,
    private formBuilder: FormBuilder,
    private cuisineService: CuisineService,
    private governorateService: GovernorateService
  ) {

    this.foodTruckForm = this.formBuilder.group({
      nameEng: ["", Validators.required],
      nameArb: ["", Validators.required],
      descriptionEng: ["", Validators.required],
      descriptionArb: ["", Validators.required],
      cuisineId: ["", Validators.required]
    });

    this.addressForm = this.formBuilder.group({
      governorateId: ["", Validators.required],
      address: ["", Validators.required],
      googleLocation: [""],
      googleLat: [0],
      googleLng: [0]
    });

    this.informationForm = this.formBuilder.group({
      FoodTruckWorkingDay: this.formBuilder.array([]),
      phoneNumber: ["", Validators.required],
      instagramAccount: ["", Validators.required],
    });

    this.foodTruckFormGroup = this.formBuilder.group({
      foodTruckForm: this.foodTruckForm,
      addressForm: this.addressForm,
      informationForm: this.informationForm
    });
  }

  ngOnInit(): void {

    this.isLoading = true;
    forkJoin([this.cuisineService.findAll(), this.governorateService.findAll()])
      .subscribe({
        next: (data: any) => {
          this.cuisines = data[0];
          this.governorates = data[1];
        },
        error: (error: any) => {
          this.isLoading = false;
          console.log(error);
        },
        complete: () => {
          this.isLoading = false;
          console.log("complete");
        }
      });
  }

  setFile(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileInputChange(fileInput: HTMLInputElement, event: any) {
    this.event = event;
    this.fileName = fileInput.files![0].name;
  }

  create() {

    if (this.data.foodTrucks.length > 0) {
      // check if the name is already exist in sportTypes arr
      if (this.data.foodTrucks.some(st =>
        st.nameEng === this.foodTruckForm?.get("nameEng")?.value ||
        st.nameArb === this.foodTruckForm?.get("nameArb")?.value
      )) {
        alert("This sport type is already exist");
        return;
      }
    }
    this.isLoading = true;

    this.progress.percentage = 0;
    this.showProgress = true;

    const formData = new FormData();
    const files = this.event.target.files;

    // for (let i = 0; i >= files.length; i++) {
    //   formData.append('files', files.item(i));
    // }

    for (let x = 0; x < files.length; x++) {

      // change file name
      const file = files[x];
      const fileName = file.name;
      const fileExtension = fileName.split(".").pop();
      const newFileName = `logo.${fileExtension}`;
      const newFile = new File([file], newFileName, { type: file.type });
      formData.append("files", newFile);
    }

    // files.item.forEach(i => formData.append('files', i));

    files.inProgress = true;
    files.progress = 0;



    const payload = {
      foodTruck: this.foodTruckForm?.value,
      address: this.addressForm?.value,
      information: this.informationForm?.value,
      user: {}
    };

    formData.append("payload", JSON.stringify(payload));

    console.log(payload)

    this.foodTruckService.create(formData).subscribe((data: any) => {
      this.dialogRef.close();
    });
  }
}
