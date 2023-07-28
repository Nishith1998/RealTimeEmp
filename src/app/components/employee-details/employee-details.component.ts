import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmployeeDetails } from 'src/app/model';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {

  @Input() employeeTitle!: string;
  @Input() employeeList!: EmployeeDetails[];

  @Output() onDragEnd = new EventEmitter<{event: CdkDragEnd, emp: EmployeeDetails}>();

  constructor() { }

  ngOnInit() {
  }

  onDragEnded(event: CdkDragEnd, emp: EmployeeDetails) {
    this.onDragEnd.emit({event, emp});
   }

}
