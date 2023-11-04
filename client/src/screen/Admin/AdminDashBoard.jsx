import { useState, useEffect } from "react"
import "../../scss/screen/Admin/AdminDash.scss"
import axios from "../../axios";
import TabsAdmin from "../../components/Admin/TabsAdmin"
import ChartAdmin from "../../components/Admin/ChartAdmin"
import calculateRevenueForDateRange from "../../utils/calculateRevenueForDateRange";
import { monthGrouping,yearGrouping,testData} from "../../utils/grouping";


function AdminDashBoard() {
  const [data, setData] = useState()
  const [revenue, setRevenue] = useState()
  const [type,setType] = useState("month")


  useEffect(() => {
    async function run() {
      let response = await axios.get("/chart-bookings");
      if (response.data) {
        setRevenue(response.data.reduce((acc, item) => acc + (item.price * item.courseDuration), 0))
        if(type == "month"){
          setData(monthGrouping(calculateRevenueForDateRange(testData).monthlyRevenue))
        }else{
          setData(yearGrouping(calculateRevenueForDateRange(testData).yearlyRevenue))
        }
      }
    }
    run()
  }, [type])
   
  return (
    <div className="admin-dash">
      <div className="info">
        <h1>Dashboard</h1>
      </div>
      <TabsAdmin  revenue={revenue}/>
      <ChartAdmin data={data} setType = {setType} setData={setData} type={type}/>
    </div>
  )
}

export default AdminDashBoard
