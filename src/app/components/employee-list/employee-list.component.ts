import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { IndexedDbService } from 'src/app/services/indexed-db.service';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent {
  

  empList: any = signal([]);
  constructor(private router: Router, private idxDbSer: IndexedDbService) {}

  ngOnInit() {
    this.idxDbSer.get().subscribe(empData => {
      console.log('indGet: ', empData)
      this.empList.set(empData);
    });
    // this.apiService.getAll().subscribe(empData => {
    //   this.empList.set(empData);
    // });

  }

  addEmployee() {
    this.router.navigate(['employeeForm']);
  }

  onDragEnded(event: any, item: any): void {
    if (event.distance.x > 100) {
      // Check if the drag distance along the x-axis is greater than 100px
      // this.deleteItem(item);
      console.log("item to delete: ", item);
      this.idxDbSer.delete(item.key).subscribe(data => console.log("deleted"), err => console.log("errors"));
    }
  }

}
