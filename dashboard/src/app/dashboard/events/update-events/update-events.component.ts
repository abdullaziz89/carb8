import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EventsService} from "../../services/events.service";

@Component({
  selector: 'app-update-events',
  templateUrl: './update-events.component.html',
  styleUrls: ['./update-events.component.css']
})
export class UpdateEventsComponent {
  eventForm: FormGroup | undefined;

  constructor(
    private dialogRef: MatDialogRef<UpdateEventsComponent>,
    private eventsService: EventsService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {event: any}
  ) {

    this.eventForm = this.formBuilder.group({
      nameEng: [data.event.nameEng, Validators.required],
      nameArb: [data.event.nameArb, Validators.required],
      descriptionEng: [data.event.descriptionEng, Validators.required],
      descriptionArb: [data.event.descriptionArb, Validators.required],
      startDate: [data.event.startDate, Validators.required],
      endDate: [data.event.endDate, Validators.required],
      location: [data.event.location, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {

    if (this.eventForm?.invalid) {
      return;
    }

    this.eventsService.update({id: this.data.event.id, enable: this.data.event.enable, ...this.eventForm?.value}).subscribe((event: any) => {
      this.dialogRef.close({updated: true});
    });
  }
}
