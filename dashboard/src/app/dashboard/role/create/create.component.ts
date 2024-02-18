import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RoleService} from "../../services/role.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  roleForm: FormGroup

  constructor(
    private dialogRef: MatDialogRef<CreateComponent>,
    private roleService: RoleService,
    private formBuilder: FormBuilder,
  ) {
    this.roleForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {

  }

  create() {
    console.log(this.roleForm.value)
    this.roleService.createRole(this.roleForm.value).subscribe({
      next: () => {
        this.dialogRef.close();
      }
    });
  }
}
