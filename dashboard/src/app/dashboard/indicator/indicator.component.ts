import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.css']
})
export class IndicatorComponent implements OnInit {

  @Input("isLoading") isLoading: boolean | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
