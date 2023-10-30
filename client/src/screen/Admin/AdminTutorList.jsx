import {useEffect, useState} from "react";
import DataTableTutor from "../../components/Admin/DataTableTutor";
import axioss from "../../axios"
import axios from "axios";
import { Tooltip as ReactTooltip } from 'react-tooltip'

function AdminTutorList() {
  const [data,setData] = useState("")
  useEffect(()=>{
    async function run(){
      let response = await axioss.get("/admin-tutor-view",{
        params:{
          limit:4
        }
      }) 
      setData(response.data)
    }
    run()
  },[])
  console.log(data)
  const columns = [
    {
      Header: 'Profile',
      accessor: 'image'
    },
    {
      Header: 'FirstName',
      accessor: 'fName'
    },
    {
      Header: 'LastName',
      accessor: 'lName'
    },
    {
      Header: 'Email',
      accessor: 'email'
    },
    {
      Header: 'Profile Completed',
      accessor: 'profileCompleted'
    },
    {
      Header: 'Blocked',
      accessor: 'isBlocked'
    },
    {
      Header: 'Schedule',
      accessor: 'view'
    },
    {
      Header: 'Documents',
      accessor: 'download'
    },
    {
      Header: 'Experience',
      accessor: 'expYear'
    },  
    {
      Header: 'Actions',
      accessor: 'actions'
    },  
  ]
  async function downloadFile(fileUrl) {
    const a = document.createElement('a');
    a.href = fileUrl;
    console.log(a.href)
    a.setAttribute('download', fileUrl.split('/').pop());
    a.click();
}
const download = {
    type:"download",
    label:(
      <span  data-tooltip-id="download" data-tooltip-content="Download all the Files">
          <i className="fa-solid fa-download" style={{cursor:"pointer"}}></i>
          <ReactTooltip id="download"/>
      </span>
    ),
    handler: async (row) => {
      const files = row.original.documents;
      await axioss.get("/download",{
            
        params:{
          url :files[0]
        }
      
    })
      // if (files.length > 0) {
      //   for (const fileUrl of files) {
      //     await axioss.get("/download",{
            
      //         params:{
      //           url :files[0]
      //         }
            
      //     })
      //   }
      // } else {
      //   alert("No Files Submitted");
      // }
    }
  };
    
  
  const tutorActions = [
    {
      type: 'block',
      label: (
        <span>
            <i className="fa-solid fa-user-slash"  data-tooltip-id="block" data-tooltip-content="Block The user"></i>
            <ReactTooltip id="block"/>
        </span>
    ),
      handler: async (id) => {
        // Handle block action for tutor with id
        // ...
      },
    },
    {
      type: 'approve',
      label: (
        <span>
          <i className="fa-solid fa-user-check" data-tip="Approve User"></i>
          <ReactTooltip />
        </span>
      ),
      handler: async (id) => {
        // Handle approve action for tutor with id
        // ...
      },
    },
  ]
  return (
    <div>
       <div className="info">
        <h1>Tutors</h1>
        
      </div>
      <div className="dataTable">
        {Object.keys(data).length === 0 ? "No Data Added" : <DataTableTutor columns={columns} data={data} actions={tutorActions} download={download} /*hiddenRows={hiddenRows}*//>}
      </div> 
    </div>
  )
}

export default AdminTutorList
