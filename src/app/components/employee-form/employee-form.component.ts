import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCalendarCellClassFunction, MatDatepicker } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTemplateComponent } from 'src/app/components/UI/date-template/date-template.component';
import { ApiService } from 'src/app/services/api.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { IndexedDbService } from 'src/app/services/indexed-db.service';


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
  isEditEnabled: boolean = false;
  employeeId!: string | null;
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<Date>;


  constructor(private route: ActivatedRoute, private fb: FormBuilder, private empService: EmployeeService, private apiService: ApiService, private router: Router, private idxDbSer: IndexedDbService) { }

  ngOnInit() {
    console.log("pathParam: ", this.route.snapshot.paramMap.get('id'));
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId !== null) {
      this.isEditEnabled = true;
      this.idxDbSer.getByKey(+this.employeeId).subscribe(empData => {
        this.initializeForm(empData)
      });
    } else {
      this.initializeForm({ name: '', role: '', fromDate: '', toDate: '' });
    }
    // this.empService.customDate.subscribe(dateValue => {
    //   this.fromDateFrom = new Date(dateValue).getDate();
    //   this.employeeForm.controls['fromDate'].patchValue(new Date(dateValue))
    // })
  }
  initializeForm(empData: { name: string, role: string, fromDate: string, toDate: string }) {
    this.employeeForm = this.fb.group({
      name: [empData.name, Validators.required],
      role: [empData.role],
      fromDate: [empData.fromDate],
      toDate: [empData.toDate]
    });
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
    if(this.isEditEnabled && this.employeeId !== null){
      console.log("form value: ", this.employeeForm);
      this.idxDbSer.put(+this.employeeId, this.employeeForm.value).subscribe({
        next: val => { console.log("Employee added successfully"); this.router.navigate(['']) },
        error: error => console.log("Error adding employee: ", error)
      });
    }
    else{
      console.log("form value: ", this.employeeForm);
      this.idxDbSer.put(Date.now(), this.employeeForm.value).subscribe({
        next: val => { console.log("Employee added successfully"); this.router.navigate(['']) },
        error: error => console.log("Error adding employee: ", error)
      });
    }

    // save the record
  }
}
