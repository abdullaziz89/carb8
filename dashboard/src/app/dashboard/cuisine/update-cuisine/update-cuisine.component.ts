import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CuisineService} from "../../services/cuisine.service";

@Component({
  selector: "app-update-business",
  templateUrl: "./update-cuisine.component.html",
  styleUrls: ["./update-cuisine.component.css"]
})
export class UpdateCuisineComponent implements OnInit {

  sportTypeForm: FormGroup | undefined;
  isLoading: boolean = false;

  sportTypes: any[] = [];
  sportType: any;

  constructor(
    private dialogRef: MatDialogRef<UpdateCuisineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sportTypes: any[], sportType: any },
    private formBuilder: FormBuilder,
    private sportTypeService: CuisineService
  ) {

    this.sportTypes = this.data.sportTypes;
    this.sportType = this.data.sportType;

    this.sportTypeForm = this.formBuilder.group({
      nameEng: [this.sportType.nameEng, Validators.required],
      nameArb: [this.sportType.nameArb, [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  updateBusiness() {

    // update sportType data nameEng, nameArb
    this.sportType.nameEng = this.sportTypeForm?.get("nameEng")?.value;
    this.sportType.nameArb = this.sportTypeForm?.get("nameArb")?.value;

    // remove image from sportType
    delete this.sportType.image;

    this.isLoading = true;
    this.sportTypeService.update(this.sportType).subscribe((data: any) => {
      this.isLoading = false;
      this.dialogRef.close(data);
    });
  }
}
