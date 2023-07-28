import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  customDate: Subject<any> = new Subject();
  datePicker = signal<'fromDate' | 'toDate'>('fromDate');

  constructor() { }
}
