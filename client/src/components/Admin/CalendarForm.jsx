import React, { useState } from 'react';
import { monthGrouping,yearGrouping,testData } from '../../utils/grouping';
import calculateRevenueForDateRange from '../../utils/calculateRevenueForDateRange';

const CalendarForm = ({setData,type}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert('End date should not be before the start date.');
      return;
    }
    console.log(String(startDate),String(endDate))
    if(type == "month"){
      setData(monthGrouping(calculateRevenueForDateRange(testData,new Date(startDate),new Date(endDate)).monthlyRevenue))
    }else{
      setData(yearGrouping(calculateRevenueForDateRange(testData,new Date(startDate),new Date(endDate)).yearlyRevenue))
    }
     
  };

  return (
    <form onSubmit={handleSubmit} className="filterChart">
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          min={startDate}
          max={new Date().toISOString().split('T')[0]} // Set maximum to today
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default CalendarForm;
