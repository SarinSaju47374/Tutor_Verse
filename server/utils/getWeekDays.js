export default function  getWeekdays(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let currentDate = startDate;
    let weekdays = 0;

    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0) { // 0 represents Sunday
            weekdays++;
        }
        currentDate.setTime(currentDate.getTime() + oneDay);
    }

    return weekdays;
}
