import { DateHeader } from "src/app/model";

export const ROLE_LIST: string[] = [
    "Product Designer",
    "Flutter Developer",
    "QA Tester",
    "Product Owner",
]
export const FROM_DATE_HEADER: DateHeader[] = [
    {
        label: 'Today',
        value: () => new Date()
    },
    {
        label: 'Next Monday', value: () => {
            let date = new Date();
            date.setDate(date.getDate() + ((7 - date.getDay() + 1) % 7 || 7))
            return new Date(date);
        }
    },
    {
        label: 'Next Tuesday', value: () => {
            let date = new Date();
            date.setDate(date.getDate() + ((7 - date.getDay() + 2) % 7 || 7));
            return new Date(date);
        }
    },
    {
        label: 'After 1 week', value: () => {
            let date = new Date()
            date.setDate(date.getDate() + 7);
            return new Date(date);
        }
    }
]

export const TO_DATE_HEADER: DateHeader[] = [
    {
        label: 'No date', value: () => null
    },
    {
        label: 'Today', value: () => new Date()
    }
]

export const SNACK_BAR_DURATION: number = 1000; // milliseconds
export const SNACK_BAR_MSGS = {
    onAddSuccess: "Employee added successfully!!",
    onAddFail: "Sorry, not able to add employee.",
    onEditSuccess: "Edited the employee details successfully!!",
    onEditFail: "Sorry, not able to edit the employee",
    onDeleteSuccess: "Deleted the employee details successfully!!",
    onDeleteFail: "Sorry, not able to delete the employee",
    undoDeleteSuccess: "Retrieved the deleted details successfully!!",
    undoDeleteFail: "Sorry, undo failed"
}