import Box from '@mui/material/Box';
import { useRef, useState, useEffect, useMemo } from "react";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import "../../scss/screen/Admin/AdminCoursesAdd.scss";
import Select from 'react-select';
import { useFormik } from "formik";
import { courseAddSchema } from '../../schemas';
import axios from "../../axios";
import makeAnimated from 'react-select/animated';
import { ToastContainer, toast } from "react-toastify";
// import DataTable from "react-data-table-component";
import DataTable from '../../components/Admin/DataTable';
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

const options = [
  { value: '15:00', label: '3pm' },
  { value: '16:00', label: '4pm' },
  { value: '17:00', label: '5pm' },
  { value: '18:00', label: '6pm' },
  { value: '19:00', label: '7pm' },
  { value: '20:00', label: '8pm' },
  { value: '21:00', label: '9pm' },
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
  const [img, setImage] = useState({});
  const [records, setRecords] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [submitting, setSubmitting] = useState(false)
  const [data, setData] = useState({})
  const [modified,setModified] = useState(false)
  const [openMod,setOpenMod] = useState(false)

  const [modData,setModData] = useState({
    id:"",
    courseName: "",
    price: "",
    grade: "",
    board: "",
    desc: "",
    image: "",
    duration: "",
    isHidden:"",
  })
  // const [isHidden,setisHidden] = useState(false) 

  const [hiddenRows, setHiddenRows] = useState([]);
  useEffect(() => {
    console.log("Bazinga")
    async function getCourses() {
      try {
        let response = await axios.get("/course-view");

        setData(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    getCourses();
    // toast.success("Adaasdf")
  }, [modified])
  console.log("😀😀😀😀😀😀😀", data)

  const initialValues = {
    courseName: "",
    price: "",
    grade: "",
    board: "",
    desc: "",
    image: "",
    duration: "",

  }
  let initialValues2=modData;
   
  // 
  const columns = [
    {
      Header: 'Id',
      accessor: '_id'
    },
    {
      Header: 'Course Name',
      accessor: 'courseName'
    },
    {
      Header: 'Grade',
      accessor: 'grade'
    },
    {
      Header: 'Board',
      accessor: 'board'
    },
    {
      Header: 'Price',
      accessor: 'price'
    },
    {
      Header: 'Duration (Months)',
      accessor: 'duration'
    },
    {
      Header: 'Description',
      accessor: 'desc'
    },
    {
      Header: 'Preview',
      accessor: 'image'
    },
    {
      Header: 'Hidden',
      accessor: 'isHidden'
    },
    {
      Header: 'Actions',
      accessor: 'actions'
    },
  ]
  const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: courseAddSchema,
    onSubmit: async (values, action) => {
      try {
        setSubmitting(true);
        console.log(values);
        const preview = document.getElementById('image-preview');

        const response = await axios.post("/course-add", { ...values, image: img.result })
        if (response.data.error) {
          toast.error(response.data.error);
          action.resetForm();
          setSelectedOption('');
          preview.src = "https://png.pngitem.com/pimgs/s/244-2446110_transparent-social-media-clipart-black-and-white-choose.png";
        } else {
          toast.success(response.data)
          action.resetForm();
          setSelectedOption('')
          preview.src = "https://png.pngitem.com/pimgs/s/244-2446110_transparent-social-media-clipart-black-and-white-choose.png";
        }

      } catch (err) {
        console.log(err)
      } finally {
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
  const handleOpen = () => {
    showOpen(!open);
  }
  
  const courseActions = [
    { 
      type:'edit',
      label: <i className="fa-solid fa-pen-to-square"></i>,
      handler: (id, courseName, grade, board, price, duration, desc, image) => {
        // Handle edit action for course with id
        
        setModData({
          id:id,
          courseName:courseName,
          price:price,
          grade:grade,
          board:board,
          desc:desc,
          image:image,
          duration:duration,
        })
        console.log("initialvalues 2: ",initialValues2)
         
          formik2.setValues({
            id: id,
            courseName: courseName,
            price: price,
            grade: grade,
            board: board,
            desc: desc,
            image: image,
            duration: duration,
          });
          setOpenMod(!openMod);
   
      },
    },
    {
      type: 'hideunhide',
      label: <i className="fa-solid fa-eye-slash"></i>,
      handler: async (id) => {
        // Handle hide/unhide action for course with id
        console.log(`Hide/Unhide action clicked for course with id: ${id}`);
        let response = await axios.patch("/course-hide",{
          id:id
        })
        if(response.data.success){
          setModified(!modified)
          setHiddenRows((prevHiddenRows) => {
            const isHidden = prevHiddenRows.includes(id);
            if (isHidden) {
              return prevHiddenRows.filter(rowId => rowId !== id);
            } else {
              return [...prevHiddenRows, id];
            }
          });
          
        }
        
      },
    },
  ];
  // console.log(hiddenRows)
  console.log("initialvalues 2 after: ",initialValues2)
  const formik2 = useFormik({
    initialValues: modData || {},
    validationSchema: courseAddSchema,
    onSubmit: async (values, action) => {
      try {
        setSubmitting(true);

        const preview = document.getElementById('image-preview');

        const response = await axios.post("/course-modify", { ...values, image: img.result || "" })
        if (response.data.error) {
          toast.error(response.data.error);
          action.resetForm();
          setSelectedOption('');
          preview.src = "https://png.pngitem.com/pimgs/s/244-2446110_transparent-social-media-clipart-black-and-white-choose.png";
        } else {
          toast.success(response.data)
          action.resetForm();
          setSelectedOption('')
          preview.src = "https://png.pngitem.com/pimgs/s/244-2446110_transparent-social-media-clipart-black-and-white-choose.png";
        }

      } catch (err) {
        console.log(err)
      } finally {
        setSubmitting(false);
      }

    }
  })
  const handleOpenMod = () => {
    setOpenMod(!openMod);
  }

  const animatedComponents = makeAnimated();
  return (
    <div className="content-admin">

      <div className="info">
        <h1>Courses</h1>
        <button onClick={handleOpen}>Add New Course</button>
      </div>
      <div className="dataTable">

        {Object.keys(data).length === 0 ? "No Data Added" : <DataTable columns={columns} data={data} actions={courseActions} hiddenRows={hiddenRows}/>}
        {/* <Box sx={{ height: 400, width: '100%' }}>
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
        </Box> */}
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
              {errors.courseName && touched.courseName ? <p>{errors.courseName}</p> : null}
            </div>
            <div className="inp-modal">
              <input type="number"
                name="price"
                id="price"
                placeholder="Enter the Course price"
                value={values.price}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.price && touched.price ? <p>{errors.price}</p> : null}
            </div>
            {/* <div className="inp-modal">
            <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
          
                isMulti
                options={options}
                value={values.selectedSlots}
                onChange={(selectedOption) => {
                    setFieldValue('selectedSlots', selectedOption );
                 
                }}
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
              {errors.selectedSlots  ? <p>{errors.selectedSlots}</p>:null}
            </div> */}

            <div className="inp-modal">
              <Select
                // defaultValue={selectedOption}
                onChange={(selectedOption) => setFieldValue('grade', selectedOption?.value)}
                placeholder="Choose the Grade"
                options={options1}
                value={values.grade && options1.find(option => option.value === values.grade)}
                onBlur={handleBlur}
              />
              {errors.grade && touched.grade ? <p>{errors.grade}</p> : null}
            </div>

            <div className="inp-modal">
              <input type="number"
                name="duration"
                id="duration"
                placeholder="Course Duration in Months"
                value={values.duration}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.duration && touched.duration ? <p>{errors.duration}</p> : null}
            </div>
            <div className="inp-modal">
              <Select
                defaultValue={selectedOption}
                onChange={(selectedOption) => setFieldValue('board', selectedOption?.value)}
                value={values.board && options2.find(option => option.value === values.board)}
                onBlur={handleBlur}
                placeholder="Choose the Board"
                options={options2}
              />
              {errors.board && touched.board ? <p>{errors.board}</p> : null}
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
                src='https://png.pngitem.com/pimgs/s/244-2446110_transparent-social-media-clipart-black-and-white-choose.png'
                alt="Avatar"
                id="image-preview"
                width="100"
                height="100"

              />
              {errors.image && touched.image ? <p>{errors.image}</p> : null}
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
              value={values.image}
              onBlur={handleBlur}
            />

            {submitting ? <p>Submitting......</p> : <button type="submit">Submit</button>}

          </form>

        </div>
      }
      {openMod &&
        <div className="modal">
          <i onClick={handleOpenMod} className="fa-solid fa-xmark"></i>
          <div className="info">
           Modify The Data
           
          </div>
          <form onSubmit={formik2.handleSubmit}>
            
            <div className="inp-modal">
              <input type="text"
               
                name="courseName"
                id="courseName"
                value={formik2.values.courseName}
                onChange={formik2.handleChange}
                onBlur={formik2.handleBlur}
                placeholder="Class {Grade} {CourseName}"
              />
              {formik2.errors.courseName && formik2.touched.courseName ? <p>{formik2.errors.courseName}</p> : null}
            </div>
            <div className="inp-modal">
              <input type="number"
                name="price"
                id="price"
                placeholder="Enter the Course price"
                value={formik2.values.price}
                onChange={formik2.handleChange}
                onBlur={formik2.handleBlur}
              />
              {formik2.errors.price && formik2.touched.price ? <p>{formik2.errors.price}</p> : null}
            </div>
            {/* <div className="inp-modal">
            <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
          
                isMulti
                options={options}
                value={values.selectedSlots}
                onChange={(selectedOption) => {
                    setFieldValue('selectedSlots', selectedOption );
                 
                }}
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
              {errors.selectedSlots  ? <p>{errors.selectedSlots}</p>:null}
            </div> */}

            <div className="inp-modal">
              <Select
                // defaultValue={selectedOption}
                onChange={(selectedOption) => formik2.setFieldValue('grade', selectedOption?.value)}
                placeholder="Choose the Grade"
                options={options1}
                value={formik2.values.grade && options1.find(option => option.value === formik2.values.grade)}
                onBlur={formik2.handleBlur}
              />
              {formik2.errors.grade && formik2.touched.grade ? <p>{formik2.errors.grade}</p> : null}
            </div>

            <div className="inp-modal">
              <input type="number"
                name="duration"
                id="duration"
                placeholder="Course Duration in Months"
                value={formik2.values.duration}
                onChange={formik2.handleChange}
                onBlur={formik2.handleBlur}
              />
              {formik2.errors.duration && formik2.touched.duration ? <p>{formik2.errors.duration}</p> : null}
            </div>
     
            <div className="inp-modal">
              <Select
                defaultValue={selectedOption}
                onChange={(selectedOption) => formik2.setFieldValue('board', selectedOption.value)}
                value={formik2.values.board && options2.find(option => option.value === formik2.values.board)}
                onBlur={formik2.handleBlur}
                placeholder="Choose the Board"
                options={options2}
              />
              {formik2.errors.board && formik2.touched.board ? <p>{formik2.errors.board}</p> : null}
            </div>
    
            <div className="inp-modal">
              <textarea
                name="desc"
                id="desc"
                value={formik2.values.desc}
                onChange={formik2.handleChange}
                onBlur={formik2.handleBlur}
                placeholder="Write out the description about this course in deatail"
              />
              {formik2.errors.desc && formik2.touched.desc ? <p>{formik2.errors.desc}</p> : null}
            </div>

            <div className="pre" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
              <img
                src='formik2.values.image'
                alt="Avatar"
                id="image-preview"
                width="100"
                height="100"

              />
              {formik2.errors.image && formik2.touched.image ? <p>{formik2.errors.image}</p> : null}
            </div>
  
            <input
              type="file"
              // style={  { display: 'none' }}
              hidden
              ref={fileInputRef}
              id="image"
              name="image"
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
              value = {""}
              onBlur={formik2.handleBlur}
            />

            {submitting ? <p>Submitting......</p> : <button type="submit">Submit</button>}  
            <div className="inp-modal">
              <input type="text"
                hidden
           
                name="id"
                id="id"
                value={formik2.values.id}
                placeholder="Class {Grade} {CourseName}"
              />
              
            </div>
          </form>

        </div>
      }
    </div>
  )
}

export default AdminCourseAdd
