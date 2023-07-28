import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { FROM_DATE_HEADER } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  customDate: Subject<any> = new Subject();
  toDate: Subject<any> = new Subject();
  // datePicker: Subject<any> = new Subject();
  datePicker: any = signal(FROM_DATE_HEADER);

  constructor() { }
}
