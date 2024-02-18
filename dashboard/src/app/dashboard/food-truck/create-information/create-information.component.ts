import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AcademyInformationGender} from "../AcademyInformationGender";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: "app-create-information",
  templateUrl: "./create-information.component.html",
  styleUrls: ["./create-information.component.css"]
})
export class CreateInformationComponent implements OnInit {

  @Input("informationForm") informationForm: FormGroup | undefined;

  days: any[] = [
    {id: 0, name: "All Days"},
    {id: 1, name: "Week Days"},
    {id: 2, name: "Weekend"},
    {id: 3, name: "Sunday"},
    {id: 4, name: "Monday"},
    {id: 5, name: "Tuesday"},
    {id: 6, name: "Wednesday"},
    {id: 7, name: "Thursday"},
    {id: 8, name: "Friday"},
    {id: 9, name: "Saturday"}
  ];

  constructor(
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.addWorkingDay();
  }

  get workingDays() {
    return this.informationForm?.get('FoodTruckWorkingDay') as FormArray;
  }

  removeWorkingHour(i: number) {
    this.workingDays.removeAt(i);
  }

  addWorkingDay(selectedDay?: number) {
    this.workingDays.push(this.formBuilder.group({
      day: [selectedDay ? selectedDay: '', Validators.required],
      workingFrom: ['', Validators.required],
      workingTo: ['', Validators.required],
      enable: [true]
    }));
  }


  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
