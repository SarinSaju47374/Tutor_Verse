import Box from '@mui/material/Box';
import { useRef, useState ,useEffect,useMemo} from "react";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import "../../scss/screen/Admin/AdminCoursesAdd.scss";
import Select from 'react-select';
import {useFormik} from "formik";
import { courseAddSchema } from '../../schemas';
import axios from "../../axios";
import makeAnimated from 'react-select/animated';
import {ToastContainer,toast} from "react-toastify";
import DataTable from "react-data-table-component";
const options1 = [
  { value: 1, label: 'Class 1' },
  { value: 2, label: 'Class 2' },
  { value: 4, label: 'Class 4' },
  { value: 5, label: 'Class 5' },
  { value: 6, label: 'Class 6' },
  { value: 7, label: 'Class 7' },
  { value: 8, label: 'Class 8' },
  { value: 9, label: 'Class 9' },
  { value: 10, label: 'Class 10' },
  { value: 11, label: 'Class 11' },
  { value: 12, label: 'Class 12' },
];
const options2 = [
  { value: 'CBSE', label: 'CBSE' },
  { value: 'Kerala Board', label: 'Kerala Board' },
  { value: 'ICSE', label: 'ICSE' },

];


const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];
// const customStyles = {
//   headRow: {
//     style: {
//       backgroundColor: "black",
//       color: "white",
//     },
//   },
//   headCells: {
//     style: {
//       fontSize: "16px",
//       fontWeight: "600",
//       textTransform: "uppercase",
//     },
//   },
//   cells: {
//     style: {
//       fontSize: "15px",
//     },
//   },
// };
const options = [
  { value: '3:00pm', label: '3pm' },
  { value: '4:00pm', label: '4pm' },
  { value: '5:00pm', label: '5pm' },
  { value: '6:00pm', label: '6pm' },
  { value: '7:00pm', label: '7pm' },
  { value: '8:00pm', label: '8pm' },
  { value: '9:00pm', label: '9pm' },
]
const column = [
  {
    name: "Sl. No.",
    selector: (row, index) => index + 1,
    sortable: true,
  },
  {
    name: "Name",
    selector: (row) => row.userName,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: "Business Name",
    selector: (row) => row.businessName,
    sortable: true,
  },
  {
    name: "Address",
    selector: (row) => row.address,
  },
  {
    name: "Phone Number",
    selector: (row) => row.phoneNumber,
  },
  {
    name: "Access",
    selector: (row) => row.access,
  },
];
// const columns = [
//   {
//     name: 'ID',
//     selector: 'id',
//     sortable: true,
//   },
//   {
//     name: 'Name',
//     selector: 'name',
//     sortable: true,
//   },
//   {
//     name: 'Age',
//     selector: 'age',
//     sortable: true,
//   },
//   {
//     name: 'City',
//     selector: 'city',
//     sortable: true,
//   },
// ];
//  const data = [
//     { id: 1, name: 'John Doe', age: 30, city: 'New York' },
//     { id: 2, name: 'JjhfdSmith', age: 25, city: 'Los Angeles' },
//     { id: 2, name: 'Jadfghth', age: 25, city: 'Los Angeles' },
//     { id: 2, name: 'sgsdSmith', age: 25, city: 'Los Angeles' },
//     { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
//     { id: 2, name: 'Jaasdfmith', age: 25, city: 'Los Angeles' },
//     { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
//     { id: 2, name: 'Jaasdf', age: 25, city: 'Los Angeles' },
//     { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
//     { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
//     { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
//     { id: 2, name: 'Jgmmith', age: 25, city: 'Los Angeles' },
//     { id: 2, name: 'Janxcvbith', age: 25, city: 'Los Angeles' },
//     // Add more dummy rows as needed
//   ];
function AdminCourseAdd() { 
  const [open, showOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const fileInputRef = useRef();
  const [img,setImage] = useState({});
  const [records, setRecords] = useState([]);
  
  const [submitting,setSubmitting] = useState(false)

  const initialValues = {
    courseName:"",
    rate:"",
    grade:"",
    board:"",
    desc:"",
    image:""    
  }
  const columns = useMemo(()=>[
    { field: 'image', headerName: 'Preview', width: 100 },
    {
      field: 'courseName',
      headerName: 'Course Name',
      width: 150,
  
    },
    {
      field: 'grade',
      headerName: 'Grade',
      type: 'number',
      width: 110,
  
    },
    {
      field: 'board',
      headerName: 'Board',
      width: 150,
    },
    {
      field: 'courseDuration',
      headerName: 'Course Duration (Months)',
      sortable: true,
      width: 110,
      type:'number',
    }
  ],[]);
  const { values, errors, touched, handleBlur, handleChange, handleSubmit,setFieldValue} = useFormik({
      initialValues: initialValues,
      validationSchema: courseAddSchema,
      onSubmit: async (values, action) => {
        try{
          setSubmitting(true);
          const response = await axios.post("/course-add",{...values,image:img.result})
          if(response.data.error){
            toast.error(response.data.error);
            action.resetForm();
          }else{
            toast.success(response.data)
            action.resetForm();
          }

        }catch(err){
          console.log(err)
        }finally{
          setSubmitting(false);
        }
        
      }
  })


  const handleAvatarClick = () => {
    fileInputRef.current.click(); // Trigger file input click when avatar is clicked
  };

  const handleFileChange = (event) => {
   
    handleChange(event);
    const selectedFile = event.target.files[0];
    console.log(selectedFile)
    if (selectedFile) {
      console.log("Im in");
      // Perform any necessary actions with the selected file
      // For example, you can display a preview of the image
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = (e) => {
        const preview = document.getElementById('image-preview');
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      setImage(reader)
      
      console.log("Uahooooo")
      // setFieldValue('image',image);
    }
     
  };
  const handleOpen =()=>{
    showOpen(!open);
  }
  console.log(errors)
  useEffect(()=>{
    // toast.success("Adaasdf")
  },[])
  const animatedComponents = makeAnimated();
  return (
    <div className="content-admin">
      
      <div className="info">
        <h1>Courses</h1>
        <button onClick={handleOpen}>Add New Course</button>
      </div>
      <div className="dataTable">
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            className="dataGrid"
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 800 }
              }
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            disableColumnFilter
            disableDensitySelector
            disableColumnSelector
          />
        </Box>
      </div>
      {open &&
        <div className="modal">
          <i onClick={handleOpen} className="fa-solid fa-xmark"></i>
          <div className="info">
            Add Course
          </div>
          <form onSubmit={handleSubmit}>
            <div className="inp-modal">
              <input type="text"
                name="courseName"
                id="courseName"
                value={values.courseName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Class {Grade} {CourseName}"
              />
              {errors.courseName && touched.courseName ? <p>{errors.courseName}</p>:null}
            </div>
            <div className="inp-modal">
              <input type="number"
                name="rate"
                id="rate"
                placeholder="Rate / Hr"
                value={values.rate}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.rate && touched.rate ? <p>{errors.rate}</p>:null}
            </div>
            <div className="inp-modal">
            <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                defaultValue={[options[4], options[5]]}
                isMulti
                options={options}
                styles={{
                  multiValue: (provided) => ({
                    ...provided,
                    display: 'inline-grid',
               
// Occupies the row
                    // margin: '2px', // Adds some spacing between values
                  }), 
                  multiValueLabel: (provided) => ({
                    ...provided,
                    whiteSpace: 'nowrap', // Prevents the label from breaking into a new line
                  }),
                  multiValueRemove: (provided) => ({
                    ...provided,
                    cursor: 'pointer',
                  }),
                }}
              />
              {errors.rate && touched.rate ? <p>{errors.rate}</p>:null}
            </div>

            <div className="inp-modal">
              <Select 
                defaultValue={selectedOption}
                onChange={(selectedOption) => setFieldValue('grade', selectedOption?.value)}
                placeholder="Choose the Grade"
                options={options1}
                value={options1.find(option => option.value === values.grade)}
                onBlur={handleBlur}
              />
              {errors.grade && touched.grade ? <p>{errors.grade}</p>:null}
            </div>

            <div className="inp-modal">
              <Select
                defaultValue={selectedOption}
                onChange={(selectedOption) => setFieldValue('board', selectedOption?.value)}
                value={options2.find(option => option.value === values.board)}
                onBlur={handleBlur}
                placeholder="Choose the Board"
                options={options2}
              />
              {errors.board && touched.board ? <p>{errors.board}</p>:null}
            </div>
            <div className="inp-modal">
            <textarea
              name="desc"
              id="desc"
              value={values.desc}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Write out the description about this course in deatail"
            />
            {errors.desc && touched.desc ? <p>{errors.desc}</p> : null}
            </div>

            <div className="pre" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
              <img
                src="https://png.pngitem.com/pimgs/s/244-2446110_transparent-social-media-clipart-black-and-white-choose.png"
                alt="Avatar"
                id="image-preview"
                width="100"
                height="100"
                
              />
              {errors.image && touched.image ? <p>{errors.image}</p>:null}
            </div>

            <input
              type="file"
              // style={{ display: 'none' }}
              hidden
              ref={fileInputRef}
              id="image"
              name="image"
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
              value={vaxlues.image}
              onBlur={handleBlur}
            />

            {submitting?<p>Submitting......</p>:<button type="submit">Submit</button>}

          </form>

        </div>
      }
    </div>
  )
}

export default AdminCourseAdd
