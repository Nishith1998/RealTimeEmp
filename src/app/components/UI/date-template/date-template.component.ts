import { ChangeDetectorRef, Component, Inject, Input, ViewChild, Pipe } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatCalendar, MatDatepicker } from '@angular/material/datepicker';
import { Subject, takeUntil } from 'rxjs';
import { FROM_DATE_HEADER, TO_DATE_HEADER } from 'src/app/constants';
import { DateHeader } from 'src/app/model';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-date-template',
  templateUrl: './date-template.component.html',
  styleUrls: ['./date-template.component.scss']
})
export class DateTemplateComponent<D> {
  private _destroyed = new Subject<void>();
  selectedDate!: string;
  labelList!: DateHeader[];

  constructor(
    private _empService: EmployeeService,
    private _calendar: MatCalendar<D>,
    private _dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats) {
    _calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => {
        this.selectedDate = this._dateAdapter
          .format(this._calendar.activeDate, this._dateFormats.display.dateA11yLabel)
      });
  }

  comparWithActiveDate(date1: Date | null): boolean {
    if (date1 && this.selectedDate) {
      return new Date(this.selectedDate).toDateString() === date1.toDateString();
    } else {
      return this.selectedDate === 'No Date';
    }
  }

  ngOnInit() {
    if (this._empService.datePicker() === 'fromDate') {
      this.selectedDate = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', 'day': 'numeric' });
      this.labelList = FROM_DATE_HEADER;
    } else {
      this.selectedDate = 'No Date';
      this.labelList = TO_DATE_HEADER;
    }
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return this._dateAdapter
      .format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel)
      .toLocaleUpperCase();
  }

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

  customLabelClicked(dateValue: () => Date | null) {
    this._calendar.selected = <D>dateValue() ?? null;
    this._calendar.activeDate = <D>dateValue() ?? <D>new Date();
    if (dateValue() === null) {
      this.selectedDate = 'No Date';
    }

  }

  onDateSave() {
    this._empService.customDate.next(String(this.selectedDate));
  }
}
