import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateTemplateComponent } from 'src/app/components/UI/date-template/date-template.component';


@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  @Input() formValue: { name: string, role: string, fromDate: string, toDate: string } = { name: '', role: '', fromDate: '', toDate: '' };
  employeeForm!: FormGroup;

  dateTemplate = DateTemplateComponent;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      role: [''],
      fromDate: [''],
      toDate: ['']
    });
  }

  onDateChange(value: any) {
    console.log("date change value: ", value);
  }

  onSubmit() {
    console.log("form value: ", this.employeeForm);
  }
}
