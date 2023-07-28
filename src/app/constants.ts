export const FROM_DATE_HEADER = [
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
    },
    {
        label: 'No date', value: () => null
    },
]