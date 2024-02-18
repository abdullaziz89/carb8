import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AddressService } from "../../services/address.service";

@Component({
  selector: "app-update-address",
  templateUrl: "./update-address.component.html",
  styleUrls: ["./update-address.component.css"]
})
export class UpdateAddressComponent {

  addressForm: FormGroup | undefined;
  address: any = {};

  constructor(
    private dialogRef: MatDialogRef<UpdateAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { address: any, governorates: any[] },
    private addressService: AddressService,
    private formBuilder: FormBuilder
  ) {

    this.address = this.data.address;

    this.addressForm = this.formBuilder.group({
      governorate: [this.data.governorates, Validators.required],
      address: [this.data.address.address, Validators.required],
      googleLocation: [this.data.address.googleLocation],
      lat: [this.data.address.googleLat],
      lng: [this.data.address.googleLng]
    });
  }

  update() {

    const address = {
      ...this.data.address,
      ...this.addressForm?.value
    };

    this.addressService.update(address).subscribe({
      next: (response: any) => {
        this.dialogRef.close(response);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        console.log("complete");
      }
    });
  }
}
