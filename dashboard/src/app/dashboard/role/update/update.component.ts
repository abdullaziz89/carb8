import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RoleService} from "../../services/role.service";

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  roleForm: FormGroup

  constructor(
    private dialogRef: MatDialogRef<UpdateComponent>,
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.roleForm = this.formBuilder.group({
      name: [data.role.name, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  update() {

    if (this.roleForm.get('name')?.value === this.data.role.name) {
      this.dialogRef.close();
      return;
    }

    this.data.role.name = this.roleForm.get('name')?.value;

    this.roleService.updateRole(this.data.role).subscribe({
      next: () => {
        this.dialogRef.close();
      }
    });
  }
}
