import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { ToolbarComponent } from './components/UI/toolbar/toolbar.component';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DateTemplateComponent } from './components/UI/date-template/date-template.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeListComponent,
    ToolbarComponent,
    EmployeeFormComponent,
    DateTemplateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
