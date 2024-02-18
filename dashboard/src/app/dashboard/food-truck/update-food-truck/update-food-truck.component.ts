import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-update-package',
  templateUrl: './update-food-truck.component.html',
  styleUrls: ['./update-food-truck.component.css']
})
export class UpdateFoodTruckComponent implements OnInit {

  packageForm: FormGroup | undefined;

  constructor(
    private dialogRef: MatDialogRef<UpdateFoodTruckComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {package: any},
    private formBuilder: FormBuilder,
  ) {
    this.packageForm = this.formBuilder.group({
      name: [this.data.package.name, Validators.required],
      description: [this.data.package.description, Validators.required],
      price: [this.data.package.price, Validators.required],
      enable: [this.data.package.enable],
    });
  }

  ngOnInit(): void {
  }

  updatePackage() {
    // this.packageService.update(this.data.package.id, this.packageForm?.value).subscribe((data: any) => {
    //   this.dialogRef.close();
    // });
  }
}
