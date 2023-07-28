import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatCalendar, MatDatepicker } from '@angular/material/datepicker';
import { Subject, takeUntil } from 'rxjs';
import { FROM_DATE_HEADER } from 'src/app/constants';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-date-template',
  templateUrl: './date-template.component.html',
  styleUrls: ['./date-template.component.scss']
})
export class DateTemplateComponent<D> {
  private _destroyed = new Subject<void>();
  selectedDate!: string;
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<Date>;
  labelList: any = FROM_DATE_HEADER;
  // [
  //   {label: 'Today', value: 1}, 
  //   {label: 'Next Monday', value: 2},
  //   {label: 'Next Tuesday', value:3 }, 
  //   {label: 'After 1 week', value:7 },
  //   {label: 'No Date', value: 0 },
  //   ]

  constructor(
    private _empService: EmployeeService,
    private _calendar: MatCalendar<D>,
    private _dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
    cdr: ChangeDetectorRef) {
    _calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => { cdr.markForCheck();    this.selectedDate = this._dateAdapter
        .format(this._calendar.activeDate, this._dateFormats.display.dateA11yLabel) });

    _calendar._userSelection.subscribe(date => console.log("Date change", date))
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    console.log("activeDate: ", this._calendar.activeDate)

    return this._dateAdapter
      .format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel)
      .toLocaleUpperCase();
  }

  // get selectedDate() {
  //   console.log("activeDate: ", this._calendar.activeDate);
  //   return this._dateAdapter
  //     .format(this._calendar.activeDate, this._dateFormats.display.dateA11yLabel)
  //   // .toLocaleUpperCase();
  // }

  // set selected(value: string) {
  //   this._selectedValue = value;
  // }

  previousClicked() {
    this._calendar.activeDate = this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1)
    this.selectedDate = this._dateAdapter
    .format(this._calendar.activeDate, this._dateFormats.display.dateA11yLabel)
  }

  nextClicked() {
    this._calendar.activeDate = this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1)
    this.selectedDate = this._dateAdapter
    .format(this._calendar.activeDate, this._dateFormats.display.dateA11yLabel)
  }

  customLabelClicked(dateValue: () => D) {
    this._calendar.selected = dateValue() ?? null;
    this._calendar.activeDate = dateValue() ?? <D>new Date();
    if(dateValue() === null)
    this.selectedDate = 'No Date'
    // if (noOfDays === 0) {
    //   this.selectedDate = 'No date';
    //   this._calendar.selected = null;
    // } else {
    //   this._calendar.activeDate = this._dateAdapter.addCalendarDays(this._calendar.activeDate, noOfDays);
    //   this._calendar.selected = this._calendar.activeDate;
    //   this.selectedDate = this._dateAdapter
    //   .format(this._calendar.activeDate, this._dateFormats.display.dateA11yLabel) 
    // }

  }

  myFun(value: any) {
    console.log("value: ", value);
    this._empService.customDate.next(String(this._calendar.activeDate));
  }
}
