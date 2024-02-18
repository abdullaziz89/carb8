import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {RoleService} from "../../services/role.service";
import {MatDialog} from "@angular/material/dialog";
import {UpdatePasswordComponent} from "../update-password/update-password.component";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  isLoading: boolean = false;

  user: any = {}

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private roleService: RoleService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userService.getUserById(params["id"]).subscribe(data => {
        this.user = data;
        // console.log(this.user)
        // this.roleService.getRoleById(this.user.userRole.id).subscribe(data => {
        //   this.user.role = data;
        // });
      });
    });
  }

  goBack(): void {
    this.router.navigate(['users']);
  }

  updateEnable(slideToggle: any) {
    this.isLoading = true;
    this.userService.updateEnable({ userId: this.user.id, enable: !slideToggle.checked }).subscribe({
      next: () => {
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  changePassword() {
    this.dialog.open(UpdatePasswordComponent, {
      data: {userId: this.user.id},
      width: "500px"
    });
  }
}
