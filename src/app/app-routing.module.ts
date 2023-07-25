import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeFormComponent } from 'src/app/components/employee-form/employee-form.component';
import { EmployeeListComponent } from 'src/app/components/employee-list/employee-list.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/employeeList' },
  {
    path: 'employeeList', component: EmployeeListComponent
  },
  {
    path: 'employeeForm', component: EmployeeFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
