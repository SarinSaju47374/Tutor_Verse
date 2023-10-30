import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area } from "recharts"
import CalendarForm from "./CalendarForm"
function ChartAdmin({data,setType,setData,type,revenue}) {
    // let data = [
    //     { "name": "October, 2023", "pv": 6000 },
    //     { "name": "November, 2023", "pv": 203 },
    //     { "name": "December, 2023", "pv": 303 },
    //     { "name": "January, 2024", "pv": 800 },
    //     { "name": "February, 2024", "pv": 432 },
    //     { "name": "March, 2024", "pv": 700 },
    //     { "name": "April, 2024", "pv": 1200 },
    //     { "name": "May, 2024", "pv": 1500 },
    //     { "name": "June, 2024", "pv": 2000 },
    //     { "name": "July, 2024", "pv": 2500 },
    //     { "name": "August, 2024", "pv": 2800 },
    //     { "name": "September, 2024", "pv": 3000 },
    //     { "name": "October, 2024", "pv": 3500 },
    //     { "name": "November, 2024", "pv": 4000 },
    //     { "name": "December, 2024", "pv": 4300 },
    //     { "name": "January, 2025", "pv": 5000 },
    //     { "name": "February, 2025", "pv": 5500 },
    //     { "name": "March, 2025", "pv": 6000 },
    //     { "name": "April, 2025", "pv": 6500 },
    //     { "name": "May, 2025", "pv": 7000 },
    //     { "name": "June, 2025", "pv": 7500 },
    //     { "name": "July, 2025", "pv": 8000 },
    //     { "name": "August, 2025", "pv": 8500 },
    //     { "name": "September, 2025", "pv": 9000 },
    //     { "name": "October, 2025", "pv": 9500 },
    //     { "name": "November, 2025", "pv": 10000 },
    //     { "name": "December, 2025", "pv": 10500 },
    //     { "name": "January, 2026", "pv": 11000 },
    //     { "name": "February, 2026", "pv": 11500 },
    //     { "name": "March, 2026", "pv": 12000 },
    //     { "name": "April, 2026", "pv": 12500 }
    // ];

    return (
        <div className="chart">
            <div className="monthYearFilter">
                <button onClick={()=>setType("month")}>Monthly</button>
                <button onClick={()=>setType("year")}>Yearly</button>
            </div>
            <AreaChart width={720} height={220} data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>

                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                {/* <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" /> */}
                <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
            </AreaChart>
            <CalendarForm setData={setData}/>
        </div>
    )
}

export default ChartAdmin
