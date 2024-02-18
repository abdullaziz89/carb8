import { Component, Inject, Injectable } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GovernorateService } from "../../services/governorate.service";

@Component({
  selector: "app-create-governorate",
  templateUrl: "./create-governorate.component.html",
  styleUrls: ["./create-governorate.component.css"]
})
export class CreateGovernorateComponent {

  governorateForm: FormGroup | undefined;

  constructor(
    private dialogRef: MatDialogRef<CreateGovernorateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { governorates: any[] },
    private formBuilder: FormBuilder,
    private governorateService: GovernorateService
  ) {
    this.governorateForm = this.formBuilder.group({
      nameEng: ["", [Validators.required, this.checkExistingName("nameEng", data.governorates)]],
      nameArb: ["", [Validators.required, this.checkExistingName("nameArb", data.governorates)]]
    });
  }

  create() {
    const governorate = {
      ...this.governorateForm?.value,
      enable: true
    };
    this.governorateService.create(governorate).subscribe(data => {
      this.dialogRef.close(data);
    });
  }

  checkExistingName(controllerName: string, array: any[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {

      if (controllerName === "nameEng") {
        const checkNameExists = array.find((governorate: any) => governorate.nameEng === control.value);
        if (checkNameExists) {
          return { isExisting: true };
        }
        return null;
      }

      if (controllerName === "nameArb") {
        const checkNameExists = array.find((governorate: any) => governorate.nameArb === control.value);
        if (checkNameExists) {
          return { isExisting: true };
        }
        return null;
      }

      return null;
    };
  }
}
