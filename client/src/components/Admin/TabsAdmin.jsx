import React, { useEffect, useState } from 'react'
import axios from "../../axios"
function TabsAdmin({ revenue }) {
  const [tutCount, setTutCount] = useState(null)
  const [studCount, setStudCount] = useState(null)
  function formatLargeNumber(number) {
    const suffixes = ["", "K", "Lakh", "Cr", "Arab", "Kharab", "Neel", "Padma", "Shankh"];

    let suffixIndex = 0;
    while (number >= 1000) {
      number /= 1000;
      suffixIndex++;
    }

    // Remove decimal if it's .0
    const formattedNumber = number % 1 === 0 ? number.toFixed(0) : number.toFixed(1);

    return `${formattedNumber} ${suffixes[suffixIndex]}`;
  }
  useEffect(() => {
    async function run() {
      let response = await axios.get("/tut-stud-count");
      setTutCount(response.data.tut)
      setStudCount(response.data.stud)
    }
    run()
  }, [])
  return (
    <div className="adminTabs">
      <div className="adminTab">
        <h3>Total Revenue</h3>
        <p>{formatLargeNumber(Number(revenue))}</p>
      </div>
      <div className="adminTab">
        <h3>Total Students</h3>
        <p>{formatLargeNumber(Number(studCount))}</p>
      </div>
      <div className="adminTab">
        <h3>Total Tutors</h3>
        <p>{formatLargeNumber(Number(tutCount))}</p>
      </div>


    </div>
  )
}

export default TabsAdmin
