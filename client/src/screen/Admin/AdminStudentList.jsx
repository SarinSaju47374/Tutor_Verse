import { useEffect, useRef, useState } from "react";
import DataTableStudent from "../../components/Admin/DataTableStudent";
import DataTableStudentBooking from "../../components/Admin/DataTableStudentBooking";
import axioss from "../../axios"
import axios from "axios";
import { Tooltip as ReactTooltip } from 'react-tooltip'
import Swal from 'sweetalert2'

function AdminStudentList() {
  const [data, setData] = useState("")
  const [bookings,setBookings] = useState([])
  const [show, setShow] = useState(false)
  // const show = useRef(false);
  useEffect(() => {
    async function run() {
      let response = await axioss.get("/admin-student-view", {
        params: {
          limit: 4
        }
      })
      setData(response.data)
    }
    run()
  }, [])
  // console.log(data)
  const studentColumns = [
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
      Header: 'Blocked',
      accessor: 'isBlocked'
    },
    {
      Header: 'Bookings',
      accessor: 'view'
    },
    {
      Header: 'Actions',
      accessor: 'actions'
    },
  ]
  const bookingColumns = [
    {
      Header: 'Tutor First Name',
      accessor: 'tutorId.fName'
    },
    {
      Header: 'Tutor Last Name',
      accessor: 'tutorId.lName'
    },
    {
      Header: 'Course',
      accessor: 'courseId.courseName'
    },
    {
      Header: 'Start Date',
      accessor: 'start date'
    },
    {
      Header: 'End Date',
      accessor: 'end date'
    },
    {
      Header: 'Class Counts',
      accessor: 'classCount'
    },
    {
      Header: 'Attended Class Counts',
      accessor: 'count'
    },
    {
      Header: 'Cancel Requested',
      accessor: 'cancel'
    },
    {
      Header: 'Actions',
      accessor: 'actions'
    },
  ]

  function handleShow(){
    console.log("function targetted")
    console.log(show.current)
    show.current = !show.current;
  }

 

  const studentActions = [
    {
      type: 'block',
      label: (
        <span>
          <i className="fa-solid fa-user-slash" data-tooltip-id="block" data-tooltip-content="Block The user"></i>
          <ReactTooltip id="block" />
        </span>
      ),
      handler: async (id) => {
        console.log("😡😡", id)
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel!',
          reverseButtons: true
        }).then(async (result) => {
          if (result.isConfirmed) {
            let response = await axios.delete("/delete-blog", {
              params: {
                bid: id
              }
            })
            if (response.data.success) {
              Swal.fire(
                'Blocked!',
                'The Student has been Blocked.',
                'success'
              )
            }
            // setModified(!modified)
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            Swal.fire(
              'Cancelled',
              'Your imaginary file is safe :)',
              'error'
            )
          }

        })
      },
    },
  ]
  console.log("bam bam",bookings) 
  return (
    <div>
      <div className="info">
        <h1>Students</h1>
      </div>
      <div className="dataTable">
        {!show ? Object.keys(data).length === 0 ? "No Data Added" : <DataTableStudent columns={studentColumns} data={data} actions={studentActions} show={show} setShow={setShow}/*hiddenRows={hiddenRows}*/ setBookings={setBookings}/>
        :
        Object.keys(data).length === 0 ? "No Data Added" : <DataTableStudentBooking columns={bookingColumns} data={bookings} /*actions={bookingActions}*/  />
        }
      </div>
    </div>
  )
}

export default AdminStudentList