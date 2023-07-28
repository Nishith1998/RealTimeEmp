import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, first, takeUntil } from 'rxjs';
import { DateTemplateComponent } from 'src/app/components/UI/date-template/date-template.component';
import { ROLE_LIST, SNACK_BAR_DURATION, SNACK_BAR_MSGS } from 'src/app/constants';
import { EmployeeService } from 'src/app/services/employee.service';
import { IndexedDbService } from 'src/app/services/indexed-db.service';


@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm!: FormGroup;
  dateTemplate = DateTemplateComponent;
  isEditEnabled: boolean = false;
  employeeId!: string | null;
  roleList: string[] = ROLE_LIST;
  private _destroyed = new Subject<void>();


  constructor(
    private _snackBar: MatSnackBar,
    private _route: ActivatedRoute,
    private _router: Router,
    private _fb: FormBuilder,
    private _empService: EmployeeService,
    private _indexedDBService: IndexedDbService
  ) { }

  ngOnInit() {
    this.employeeId = this._route.snapshot.paramMap.get('id');
    if (this.employeeId !== null) {
      this.isEditEnabled = true;
      this._indexedDBService.getByKey(+this.employeeId).pipe(first()).subscribe(empData => {
        this.initializeForm(empData)
      });
    } else {
      this.initializeForm({ name: '', role: '', fromDate: '', toDate: '' });
    }
    this._empService.customDate.pipe(takeUntil(this._destroyed)).subscribe(dateValue => {

      this._empService.datePicker() === 'fromDate' ?
        this.employeeForm.controls['fromDate'].patchValue(new Date(dateValue)) :
        this.employeeForm.controls['toDate'].patchValue(new Date(dateValue))
    });
  }

  initializeForm(empData: { name: string, role: string, fromDate: string, toDate: string }) {
    this.employeeForm = this._fb.group({
      name: [empData.name, Validators.required],
      role: [empData.role, Validators.required],
      fromDate: [empData.fromDate, Validators.required],
      toDate: [empData.toDate]
    });
  }

  onSubmit() {
    if (this.isEditEnabled && this.employeeId !== null) {
      this._indexedDBService.put(+this.employeeId, this.employeeForm.value).pipe(first()).subscribe({
        next: val => {
          this._snackBar.open(SNACK_BAR_MSGS.onEditSuccess, "", { duration: SNACK_BAR_DURATION });
          this._router.navigate(['']);
        },
        error: error => {
          this._snackBar.open(SNACK_BAR_MSGS.onEditFail, "", { duration: SNACK_BAR_DURATION });
        }
      });
    }
    else {
      this._indexedDBService.put(Date.now(), this.employeeForm.value).pipe(first()).subscribe({
        next: val => {
          this._router.navigate(['']);
          this._snackBar.open(SNACK_BAR_MSGS.onAddSuccess, "", { duration: SNACK_BAR_DURATION });
        },
        error: error => {
          this._snackBar.open(SNACK_BAR_MSGS.onAddFail, "", { duration: SNACK_BAR_DURATION });
        }
      });
    }
  }

  onCancel() {
    this._router.navigate(['']);
  }

  datePickerOpened(type: 'fromDate' | 'toDate') {
    this._empService.datePicker.set(type);
  }

  getDateFromDate(value: any) {
    return new Date(value);
  }

  deleteEmp() {
    if (this.employeeId) {
      this._indexedDBService.delete(+this.employeeId).pipe(first()).subscribe(data => {
        this._snackBar.open(SNACK_BAR_MSGS.onDeleteSuccess, "", { duration: SNACK_BAR_DURATION });
        this._router.navigate(['']);
      },
        err => {
          this._snackBar.open(SNACK_BAR_MSGS.onDeleteFail, "", { duration: SNACK_BAR_DURATION });
        });
    }
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
