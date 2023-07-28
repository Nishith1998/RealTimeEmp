import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { ToolbarComponent } from './components/UI/toolbar/toolbar.component';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateTemplateComponent } from './components/UI/date-template/date-template.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RestorePositionOnDragDirective } from './directives/restore-position-on-drag.directive';
import { CommonModule } from '@angular/common';
import { SortAndFilterPipe } from 'src/app/pipes/sort-and-filter.pipe';
import { EmployeeDetailsComponent } from 'src/app/components/employee-details/employee-details.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeListComponent,
    ToolbarComponent,
    EmployeeFormComponent,
    DateTemplateComponent,
    EmployeeDetailsComponent,
    RestorePositionOnDragDirective,
    SortAndFilterPipe
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
