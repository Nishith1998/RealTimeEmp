import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { DateTemplateComponent } from 'src/app/components/UI/date-template/date-template.component';
import { ApiService } from 'src/app/services/api.service';
import { EmployeeService } from 'src/app/services/employee.service';


@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  @Input() formValue: { name: string, role: string, fromDate: string, toDate: string } = { name: '', role: '', fromDate: '', toDate: '' };
  employeeForm!: FormGroup;

  dateTemplate = DateTemplateComponent;
  fromDateFrom!: number;

  constructor(private fb: FormBuilder, private empService: EmployeeService, private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      role: [''],
      fromDate: [''],
      toDate: ['']
    });

    this.empService.customDate.subscribe(dateValue => {
      this.fromDateFrom = new Date(dateValue).getDate();
      this.employeeForm.controls['fromDate'].patchValue(new Date(dateValue))
    })    
  }

  public dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = cellDate.getDate();

      // Highlight the 1st and 20th day of each month.
      return date === this.fromDateFrom ? 'example-custom-date-class' : '';
    }
    return '';
  };

  onDateChange(value: any) {
    console.log("date change value: ", value);
  }

  onSubmit() {
    console.log("form value: ", this.employeeForm);
    this.apiService.add(this.employeeForm.value).subscribe({
      next: val => { console.log("Employee added successfully"); this.router.navigate([''])},
      error: error => console.log("Error adding employee: ", error)
    });
    // save the record
  }
}
