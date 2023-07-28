import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeDetails } from 'src/app/model';
import { IndexedDbService } from 'src/app/services/indexed-db.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent {


  empList: any = signal([]);
  constructor(private router: Router, private idxDbSer: IndexedDbService) { }

  ngOnInit() {
    this.idxDbSer.get().subscribe(empData => {
      console.log('indGet: ', empData)
      this.empList.set(empData);
    });
  }

  addEmployee() {
    this.router.navigate(['employeeForm']);
  }

  editEmployee(emp: EmployeeDetails) {
    this.router.navigate(['employeeForm/' + emp.key])
  }

  onDragEnded({ event, emp }: { event: CdkDragEnd, emp: EmployeeDetails }): void {
    if (event.distance.x > 100) {
      console.log("item to edit: ", emp);
      this.editEmployee(emp)
    } else if (event.distance.x < -100 && emp.key) {
      this.idxDbSer.delete(emp.key).subscribe(data => console.log("deleted"), err => console.log("errors"));
      this.idxDbSer.get().subscribe(empData => {
        console.log('indGet2: ', empData)
        this.empList.set(empData);
      });
    }
  }

}
