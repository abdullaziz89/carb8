import {Component, OnInit} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {EventsService} from "../services/events.service";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatDialog} from "@angular/material/dialog";
import {CreateEventsComponent} from "./create-events/create-events.component";
import {UpdateEventsComponent} from "./update-events/update-events.component";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  displayedColumns: string[] = ['no','nameEng', 'nameArb', 'startDate', 'endDate', 'location', 'status', 'actions'];

  constructor(
    private eventsService: EventsService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.eventsService.getAll().subscribe((events: any) => {
      this.events.data = events;
    });
  }

  create() {
    let dialogRef = this.dialog.open(CreateEventsComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.created) {
        this.getAll();
      }
    });
  }

  update(element: any) {
    let dialogRef = this.dialog.open(UpdateEventsComponent, {
      width: '600px',
      data: {
        event: element
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.updated) {
        this.getAll();
      }
    });
  }

  updateStatus(id: string, enableToggle: MatSlideToggle) {
    this.eventsService.updateStatus(id, enableToggle.checked).subscribe((event: any) => {
      console.log(event);
    });
  }
}
