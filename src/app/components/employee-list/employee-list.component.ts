import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { SNACK_BAR_DURATION, SNACK_BAR_MSGS } from 'src/app/constants';
import { EmployeeDetails } from 'src/app/model';
import { IndexedDbService } from 'src/app/services/indexed-db.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent {


  empList = signal<EmployeeDetails[]>([]);
  constructor(private _snackBar: MatSnackBar, private router: Router, private idxDbSer: IndexedDbService) { }

  ngOnInit() {
    this.fetchEmployeeList();
  }

  addEmployee() {
    this.router.navigate(['employeeForm']);
  }

  editEmployee(emp: EmployeeDetails) {
    this.router.navigate(['employeeForm/' + emp.key])
  }

  fetchEmployeeList() {
    this.idxDbSer.get().pipe(first()).subscribe(empData => {
      this.empList.set(empData);
    });
  }

  onDragEnded({ event, emp }: { event: CdkDragEnd, emp: EmployeeDetails }): void {
    if (event.distance.x > 100) {
      this.editEmployee(emp)
    } else if (event.distance.x < -100 && emp.key) {
      this.idxDbSer.delete(emp.key).pipe(first()).subscribe(data => {
        let snackBarForDelete = this._snackBar.open(SNACK_BAR_MSGS.onDeleteSuccess, "Undo", { duration: SNACK_BAR_DURATION });
        snackBarForDelete.onAction().pipe(first()).subscribe(() => {
          if (emp.key)
            this.idxDbSer.put(+emp.key, emp).pipe(first()).subscribe({
              next: val => {
                this._snackBar.open(SNACK_BAR_MSGS.undoDeleteSuccess, "", { duration: SNACK_BAR_DURATION });
                this.fetchEmployeeList();
              },
              error: error => {
                this._snackBar.open(SNACK_BAR_MSGS.undoDeleteFail, "", { duration: SNACK_BAR_DURATION });
              }
            });
        })
      },
        err => {
          this._snackBar.open(SNACK_BAR_MSGS.onDeleteFail, "", { duration: SNACK_BAR_DURATION });
        });
      this.fetchEmployeeList();
    }
  }

}
