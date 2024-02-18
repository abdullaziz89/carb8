import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-create-address",
  templateUrl: "./create-address.component.html",
  styleUrls: ["./create-address.component.css"]
})
export class CreateAddressComponent {

  @Input("addressForm") addressForm: FormGroup | undefined;
  @Input("governorates") governorates: any[] | undefined;

  constructor() {
  }
}
