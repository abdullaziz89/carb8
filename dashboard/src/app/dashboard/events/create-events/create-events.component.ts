import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EventsService} from "../../services/events.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-events',
  templateUrl: './create-events.component.html',
  styleUrls: ['./create-events.component.css']
})
export class CreateEventsComponent implements OnInit {

  eventForm: FormGroup | undefined;

  constructor(
    private dialogRef: MatDialogRef<CreateEventsComponent>,
    private eventsService: EventsService,
    private formBuilder: FormBuilder,
  ) {

    this.eventForm = this.formBuilder.group({
      nameEng: ['', Validators.required],
      nameArb: ['', Validators.required],
      descriptionEng: ['', Validators.required],
      descriptionArb: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {

    if (this.eventForm?.invalid) {
      return;
    }

    this.eventsService.create(this.eventForm?.value).subscribe((event: any) => {
      this.dialogRef.close({created: true});
    });
  }
}
