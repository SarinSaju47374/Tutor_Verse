export default function getStartAndEndDate(monthlyDuration) {
    const today = new Date();
    const start = new Date(today);

    // If today is Sunday, set start to next Monday
    if (today.getDay() === 0) {
        start.setDate(today.getDate() + 1); // Move to tomorrow
        start.setDate(start.getDate() + 1); // Move to the day after tomorrow (Monday)
    } else {
        start.setDate(today.getDate() + 1); // Move to tomorrow
    }

    // Calculate the end date
    const end = new Date(start);
    end.setMonth(end.getMonth() + monthlyDuration);

    // Convert to ISO format (YYYY-MM-DD)
    const isoStart = start.toISOString().split('T')[0];
    const isoEnd = end.toISOString().split('T')[0];

    return { start: isoStart, end: isoEnd };
}
 
