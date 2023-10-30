export default function calculateRevenueForDateRange(bookings, startDate, endDate) {
    if (startDate && endDate) {
        if (!(startDate instanceof Date)) {
            startDate = new Date(startDate);
        }

        if (!(endDate instanceof Date)) {
            endDate = new Date(endDate);
        }

        bookings = bookings.filter(booking => {
            const bookingDate = new Date(booking.createdAt);
            return bookingDate >= startDate && bookingDate <= endDate;
        });
    }

    const monthlyRevenue = {};
    const yearlyRevenue = {};

    bookings.forEach(booking => {
        const bookingDate = new Date(booking.createdAt);
        const year = bookingDate.getFullYear();
        const month = bookingDate.getMonth() + 1; // Months are zero-based, so add 1

        if (!monthlyRevenue[year]) {
            monthlyRevenue[year] = {};
        }

        if (!monthlyRevenue[year][month]) {
            monthlyRevenue[year][month] = 0;
        }

        monthlyRevenue[year][month] += booking.price;

        if (!yearlyRevenue[year]) {
            yearlyRevenue[year] = 0;
        }
        yearlyRevenue[year] += booking.price;
    });
    return {monthlyRevenue, yearlyRevenue}
}
