import { Component, Inject } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GovernorateService } from "../../services/governorate.service";

@Component({
  selector: "app-update-governorate",
  templateUrl: "./update-governorate.component.html",
  styleUrls: ["./update-governorate.component.css"]
})
export class UpdateGovernorateComponent {

  governorateForm: FormGroup | undefined;
  governorate: any = {};

  constructor(
    private dialogRef: MatDialogRef<UpdateGovernorateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { governorate: any, governorates: any[] },
    private formBuilder: FormBuilder,
    private governorateService: GovernorateService
  ) {

    this.governorate = data.governorate;

    this.governorateForm = this.formBuilder.group({
      nameEng: [data.governorate.nameEng, [Validators.required, this.checkExistingName("nameEng", this.data.governorates)]],
      nameArb: [data.governorate.nameArb, [Validators.required, this.checkExistingName("nameArb", this.data.governorates)]]
    });
  }

  update() {

    const checkNameExists = this.data.governorates.find((governorate: any) => governorate.nameEng === this.governorateForm?.value.nameEng && governorate.nameArb === this.governorateForm?.value.nameArb);

    if (checkNameExists) {
      alert("Governorate name already exists");
      return;
    }

    this.governorate.nameEng = this.governorateForm?.value.nameEng;
    this.governorate.nameArb = this.governorateForm?.value.nameArb;
    this.governorateService.update(this.governorate).subscribe(data => {
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
