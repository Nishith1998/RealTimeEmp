import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTemplateComponent } from 'src/app/components/UI/date-template/date-template.component';
import { ROLE_LIST } from 'src/app/constants';
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
  isEditEnabled: boolean = false;
  employeeId!: string | null;
  roleList: string[] = ROLE_LIST;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private empService: EmployeeService, private router: Router, private idxDbSer: IndexedDbService) { }

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
    this.empService.customDate.subscribe(dateValue => {

      this.empService.datePicker() === 'fromDate' ?
        this.employeeForm.controls['fromDate'].patchValue(new Date(dateValue)) :
        this.employeeForm.controls['toDate'].patchValue(new Date(dateValue))
    });
  }
  initializeForm(empData: { name: string, role: string, fromDate: string, toDate: string }) {
    this.employeeForm = this.fb.group({
      name: [empData.name, Validators.required],
      role: [empData.role, Validators.required],
      fromDate: [empData.fromDate, Validators.required],
      toDate: [empData.toDate]
    });
  }

  onSubmit() {
    if (this.isEditEnabled && this.employeeId !== null) {
      console.log("form value: ", this.employeeForm);
      this.idxDbSer.put(+this.employeeId, this.employeeForm.value).subscribe({
        next: val => { console.log("Employee added successfully"); this.router.navigate(['']) },
        error: error => console.log("Error adding employee: ", error)
      });
    }
    else {
      console.log("form value: ", this.employeeForm);
      this.idxDbSer.put(Date.now(), this.employeeForm.value).subscribe({
        next: val => { console.log("Employee added successfully"); this.router.navigate(['']) },
        error: error => console.log("Error adding employee: ", error)
      });
    }
  }

  onCancle() {
    this.router.navigate(['/']);
  }

  datePickerOpened(type: 'fromDate' | 'toDate') {
    this.empService.datePicker.set(type) //:
    console.log("opened")
  }

  getDateFromDate(value: any) {
    return new Date(value);
  }

  deleteEmp() {
    if (this.employeeId)
      this.idxDbSer.delete(+this.employeeId).subscribe(data => {
        console.log("deleted");
        this.router.navigate(['/']);
      }, err => console.log("errors"));
  }
}
