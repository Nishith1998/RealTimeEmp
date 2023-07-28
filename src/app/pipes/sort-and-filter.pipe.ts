import { Pipe, PipeTransform } from '@angular/core';
import { EmployeeDetails } from 'src/app/model';

@Pipe({
  name: 'sortByFromDate',
})
export class SortAndFilterPipe implements PipeTransform {

  transform(empDetails: EmployeeDetails[], mode: 'current' | 'previous'): EmployeeDetails[] | null {
    empDetails.sort((emp1, emp2) => new Date(emp2.fromDate).getTime() - new Date(emp1.fromDate).getTime());
    let transformedValues = empDetails.filter(emp => mode === 'current' ? !emp.toDate : Boolean(emp.toDate))
    return transformedValues.length == 0 ? null : transformedValues
  }

}
