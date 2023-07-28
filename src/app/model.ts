export type EmployeeDetails = {
    key?: number;
    name: string;
    role: string;
    fromDate: string;
    toDate: string;
}

export type DateHeader = {
    label: string;
    value: () => Date | null
}