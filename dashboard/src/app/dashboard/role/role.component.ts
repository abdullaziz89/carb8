import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { RoleService } from "../services/role.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatDialog} from "@angular/material/dialog";
import {CreateComponent} from "./create/create.component";
import {UpdateComponent} from "./update/update.component";


@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit, AfterViewInit {

  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  roles: MatTableDataSource<any> = new MatTableDataSource<any>();
  roleColumns: string[] = ['no', 'name', 'enable', 'actions'];

  constructor(
    private roleService: RoleService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.roleService.getAllRoles().subscribe(data => {
      this.roles.data = data.sort((a: any, b: any) => {
        return new Date(b.createdDate).getTime() / 1000 - new Date(a.createdDate).getTime() / 1000;
      });
      this.roles._updateChangeSubscription();
    });
  }

  ngAfterViewInit(): void {
    this.roles.paginator = this.paginator!;
    this.roles.sort = this.sort!;
  }

  updateEnable(roleId: string, slideToggle: MatSlideToggle) {
    this.isLoading = true;
    this.roleService.updateEnable({ roleId: roleId, enable: slideToggle.checked })
      .subscribe({
        next: () => {
        },
        error: (err) => {
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  openCreateRole() {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  openUpdate(role: any) {
    const dialogRef = this.dialog.open(UpdateComponent, {
      width: '400px',
      data: { role: role }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
}
