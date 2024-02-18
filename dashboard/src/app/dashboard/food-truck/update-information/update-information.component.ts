import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FoodTruckInformationService } from "../../services/food-truck-information.service";
import { AcademyInformationGender } from "../AcademyInformationGender";

@Component({
  selector: "app-update-information",
  templateUrl: "./update-information.component.html",
  styleUrls: ["./update-information.component.css"]
})
export class UpdateInformationComponent {

  informationForm: FormGroup;
  academyInformation: any = {};

  academyInformationGender: any[] = Object.values(AcademyInformationGender);

  constructor(
    private dialogRef: MatDialogRef<UpdateInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { information: any },
    private formBuilder: FormBuilder,
    private informationService: FoodTruckInformationService
  ) {
    this.academyInformation = data.information;

    this.informationForm = this.formBuilder.group({
      gender: [this.data.information.gender, Validators.required],
      ageFrom: [this.data.information.ageFrom, Validators.required],
      ageTo: [this.data.information.ageTo, Validators.required],
      daysInMonth: [this.data.information.daysInMonth, Validators.required]
    });
  }

  updateInformation() {

    this.academyInformation = {
      ...this.data.information,
      ...this.informationForm?.value
    };

    this.informationService
      .update(this.academyInformation.id)
      .subscribe((data: any) => {
        this.dialogRef.close(data);
      });
  }
}
