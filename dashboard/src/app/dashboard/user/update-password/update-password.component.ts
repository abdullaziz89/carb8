import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-update-password",
  templateUrl: "./update-password.component.html",
  styleUrls: ["./update-password.component.css"]
})
export class UpdatePasswordComponent implements OnInit {

  isLoading: boolean = false;
  passwordFormGroup: FormGroup;
  passwordPattern: string = "/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/";

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UpdatePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string },
    private userService: UserService
  ) {
    this.passwordFormGroup = this.formBuilder.group({
      password: ["", [Validators.required, Validators.minLength(8)]],
      confirmPassword: ["", [Validators.required, Validators.minLength(8)]]
    }, { validators: this.confirmedValidator("password", "confirmPassword") });
  }

  ngOnInit(): void {
  }

  updatePassword() {
    console.log({ userId: this.data.userId, newPassword: this.passwordFormGroup.value.password })
    this.isLoading = true;
    this.userService
      .updateUserPassword({ userId: this.data.userId, newPassword: this.passwordFormGroup.value.password })
      .subscribe({
        next: () => {
          this.dialogRef.close();
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  confirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors["confirmedValidator"]
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
