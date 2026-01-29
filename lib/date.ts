import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    addMonths,
    subMonths,
    isSameMonth,
    isSameDay,
    isToday
} from 'date-fns';

export const getMonthDays = (date: Date) => {
    const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 }); // Monday start
    const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });

    return eachDayOfInterval({ start, end });
};

export {
    format,
    addMonths,
    subMonths,
    isSameMonth,
    isSameDay,
    isToday
};
