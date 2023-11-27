import { useEffect, useState } from "react";
import DataTableTutor from "../../components/Admin/DataTableTutor";
import "../../scss/screen/Admin/AdminTutorList.scss"
import axioss from "../../axios"
import axios from "../../axios";
import { toast } from "react-toastify"
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { InfinitySpin } from "react-loader-spinner"
function AdminTutorList() {
  const [data, setData] = useState("")
  const [modified, setModified] = useState(false)
  const [loading, setLoading] = useState(true);
  const [pop,setPop] = useState(false);
  const [id,setId] = useState();
  const [schedule,setSchedule] = useState([]);
  
  useEffect(() => {
    async function run() {
      setLoading(true);
      try {
        let response = await axioss.get("/admin-tutor-view", {
          params: {
            limit: 4
          }
        })
        setData(response.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [modified])
  useEffect(() => {
    async function run() {
      
      try {
        let response = await axios.get("/tutor-schedule",{params:{
          id
        }})
        if(response.data.schedule){
          setSchedule(response.data.schedule)
        }
      }catch(err){
        console.log(err)
      }
    }
    run()
  }, [id])

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
    type: "download",
    label: (
      <span data-tooltip-id="download" data-tooltip-content="Download all the Files">
        <i className="fa-solid fa-download" style={{ cursor: "pointer" }}></i>
        <ReactTooltip id="download" />
      </span>
    ),
    handler: async (row) => {
      const files = row.original.documents;
      console.log("BAM BAM AMIGOS")
      let response = await axioss.get("/download", {
        params: {
          url: files[0]
        }
      })
      console.log(response.data)
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
          <i className="fa-solid fa-user-slash" data-tooltip-id="block" data-tooltip-content="Block The user"></i>
          <ReactTooltip id="block" />
        </span>
      ),
      handler: async (id) => {
        let response = await axios.post("/block-tutor", {
          id
        })
        if (response.data.err) {
          toast.error(response.data.err)
        } else {
          toast.success(response.data.message)
          setModified(!modified)
        }
      },
    },
    {
      type: 'unblock',
      label: (
        <span>
          <i className="fa-solid fa-user" data-tooltip-id="unblock" data-tooltip-content="Unblock The user"></i>
          <ReactTooltip id="unblock" />
        </span>
      ),
      handler: async (id) => {
        let response = await axios.post("/unblock-tutor", {
          id
        })
        if (response.data.err) {
          toast.error(response.data.err)
        } else {
          toast.success(response.data.message)
          setModified(!modified)
        }
      },
    },

  ]
  console.log({schedule})
  return (
    <div className="adminTutList">
      <div className="info">
        <h1>Tutors</h1>

      </div>
      <div className="dataTable">
        {loading ? (
          <InfinitySpin 
            width='200'
            height='200'
            color="#41c6bf"
            wrapperStyle={{position:"absolute",top:"50%",left:"50%"}}
          />
        ) : (
          <>
            {data && Object.keys(data).length === 0 ? (
              "No Data Added"
            ) : (
              <DataTableTutor columns={columns} data={data} actions={tutorActions} download={download} setPop={setPop} setId={setId}/>
            )}
          </>
        )}
        
      </div>
    {pop && 
      (
        <div className="schedule-tut" onClick = {()=>{
          setPop(false)
          setModified(!modified)
        }}>
          <div className="modal-inf">Click the modal to <em>CLOSE</em> it</div>
          {
             schedule.length>1 ? schedule.map((ele,ind)=>
                {
                  return (
                    <>
                      <div className="schedule-courseName" key={ind}>{ele?.courseId?.courseName}</div>
                      <div className="schedule-slots">
                        {ele?.slots?.length>0 && ele?.slots.map((el,index)=>{
                          return (
                            <div className="schedule-slot" key={index}>{el.label}</div>
                          )
                        })}
                      </div>
                    </>
                  )
                }
              ):
              (
                <div className="BAM-amigo">No Schedule</div>
              )
          }
        </div>
      )
    }
    </div>
  )
}

export default AdminTutorList
