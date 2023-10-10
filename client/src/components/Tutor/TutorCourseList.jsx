import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from 'react-select';
import "../../scss/components/Tutor/TutorCourseList.scss"
import axios from "../../axios"
import debounce from "lodash/debounce";
import ReactPaginate from 'react-paginate';

import {useDispatch, useSelector} from "react-redux"
import { saveTempCourse } from "../../toolkit/slices/tutor/tutorSlice";

const options1 = [
  { value: '1', label: 'Class 1' },
  { value: '2', label: 'Class 2' },
  { value: '4', label: 'Class 4' },
  { value: '5', label: 'Class 5' },
  { value: '6', label: 'Class 6' },
  { value: '7', label: 'Class 7' },
  { value: '8', label: 'Class 8' },
  { value: '9', label: 'Class 9' },
  { value: '10', label: 'Class 10' },
  { value: '11', label: 'Class 11' },
  { value: '12', label: 'Class 12' },
];
const options2 = [
  { value: 'CBSE', label: 'CBSE' },
  { value: 'Kerala Board', label: 'Kerala Board' },
  { value: 'ICSE', label: 'ICSE' },

];
function TutorCourseList({setOpenSlotForm, setOpenSlotSelect}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [courses, setCourses] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [pages,setPages] = useState(0)

  const dispatch = useDispatch();

//Search,Filter and Pagination
  const [search,setSearch] = useState("");
  const [grade,setGrade] = useState("");
  const [board,setBoard] = useState("");
  const [limit] = useState(4)
  useEffect(() => {
    async function run() {
      let response = await axios.get(`/course-view?limit=${limit}`);
 
      setCourses(response.data);
      setPages(response.data.totalPages)
    }
    run()
  }, [])
  
 


  //Search Function using Debounce
  const searchDebounce = debounce(async function (value) {

    try {
      setSearch(value);
      const response = await axios.get(`/course-view?grade=${grade}&board=${board}&search=${value}&limit=${limit}`);
      setCourses(response.data);
      setPages(response.data.totalPages)
    } catch (error) {
      console.error('Error checking email:', error);
      return false; // Return false in case of an error
    }

  }, 1000);

  //The function that handles search input value 
  const handleChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
    searchDebounce(value);
  };

  //This handles filter GRADE
  const handleGrade = async (selectedOption) => {
    setSelectedOption(selectedOption);
    setGrade(selectedOption.value);

    try {
      //Search and Filter works together
      const response = await axios.get(`/course-view?grade=${selectedOption.value}&board=${board}&search=${search}&limit=${limit}`);
      
      // Handle the response data here
      setCourses(response.data);
      setPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  //This handles filter BOARD
  const handleBoard = async (selectedOption) => {
    setSelectedOption(selectedOption);
    setBoard(selectedOption.value);

    try {
      //Search and Filter works together
      const response = await axios.get(`/course-view?grade=${grade}&board=${selectedOption.value}&search=${search}&limit=${limit}`);
      
      // Handle the response data here
      setCourses(response.data);
      setPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  //Handles page change Along with serched and filtered Results
  const handelPageChange=async (data)=>{
    try{
      const response = await axios.get(`/course-view?page=${data.selected+1}&grade=${grade}&board=${board}&search=${search}&limit=${limit}`);
      setCourses(response.data)
      
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className="tutor-course-list">
      <i className="fa-solid fa-xmark close" onClick={()=>setOpenSlotForm(false)}></i>
      <div className="search-options">
        <div className="inp">
          <input type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Type out the Course Name"
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
        <div className="sel">

          <Select
            defaultValue={selectedOption}
            onChange={handleGrade}
            placeholder="Choose the Grade"
            options={options1}
          />
          <Select
            defaultValue={selectedOption}
            onChange={handleBoard}
            placeholder="Choose the Board"
            options={options2}
          />
        </div>
      </div>
      <div className="course-list">
        {Array.isArray(courses.courses) && (courses.courses).length >= 1 ? (
          courses.courses.map(course => (
            <div   className="part2-card" key={course._id} onClick={()=>{
              console.log("asdfasdfasdfasdfadfs")
              // dispatch(saveTempCourse(course._id))
              localStorage.setItem('courseTempId',course._id);
              setOpenSlotSelect(true)
              
            }}>
              <div className="part2-card-img">
                <img
                  src={course.image}
                  alt=""
                />
              </div>
              <div className="part2-para">
                <div className="title">{course.courseName}</div>
                <p>
                  {course.board}
                </p>
                <p>
                  {course.desc}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ gridColumn: "span 4", textAlign: "center" }}>No Such Courses</p>
        )}
      </div>

      <div className="course-pagination">
        <ReactPaginate
          previousLabel = {<i className="fa-solid fa-hand-point-left"></i>}
          nextLabel = {<i className="fa-solid fa-hand-point-right"></i>}
          pageCount={pages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={3}
          onPageChange={handelPageChange}
        />
      </div>
    </div>
  );
}

export default TutorCourseList;
