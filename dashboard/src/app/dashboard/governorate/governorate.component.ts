import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { GovernorateService } from "../services/governorate.service";
import { MatDialog } from "@angular/material/dialog";
import { CreateGovernorateComponent } from "./create-governorate/create-governorate.component";
import { UpdateGovernorateComponent } from "./update-governorate/update-governorate.component";
import { MatSlideToggle } from "@angular/material/slide-toggle";

@Component({
  selector: "app-governorate",
  templateUrl: "./governorate.component.html",
  styleUrls: ["./governorate.component.css"]
})
export class GovernorateComponent implements OnInit {

  governorates: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ["no", "nameEng", "nameArb", "enabled", "actions"];

  constructor(
    private governorateService: GovernorateService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.governorateService.findAll().subscribe(data => {
      this.governorates.data = data;
    });
  }

  create() {
    const dialogRef = this.dialog.open(CreateGovernorateComponent, {
      width: "500px",
      data: {
        governorates: this.governorates?.data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.governorates?.data.push(result);
        this.governorates?._updateChangeSubscription();
      }
    });
  }

  update(governorate: any) {
    const dialogRef = this.dialog.open(UpdateGovernorateComponent, {
      width: "500px",
      data: { governorate: governorate }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.governorates?.data.findIndex((governorate: any) => governorate.id === result.id);
        this.governorates.data[index] = result;
        this.governorates?._updateChangeSubscription();
      }
    });
  }

  delete(id: any) {
    this.governorateService.delete(id).subscribe(data => {
      this.governorates.data = this.governorates?.data.filter((governorate: any) => governorate.id !== id);
      this.governorates._updateChangeSubscription();
    });
  }

  updateStatus(id: string, enableToggle: MatSlideToggle) {
    this.governorateService.updateEnabled(id, enableToggle.checked).subscribe(data => {
      const index = this.governorates?.data.findIndex((governorate: any) => governorate.id === id);
      this.governorates.data[index].enabled = enableToggle.checked;
      this.governorates?._updateChangeSubscription();
    });
  }
}
