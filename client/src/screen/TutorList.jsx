import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Select from 'react-select';
import "../scss/screen/CourseList.scss"
import axios from "../axios"
import debounce from "lodash/debounce";
import ReactPaginate from 'react-paginate';
import "../scss/screen/Student/TutorList.scss"
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
function TutorList() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [tutors, setTutors] = useState([])
  const [filteredTutors, setFilteredTutors] = useState([])
  const [data, setData] = useState({});
  const [inputValue, setInputValue] = useState("")
  const [pages, setPages] = useState(0)

  //Search,Filter and Pagination
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("");
  const [board, setBoard] = useState("");
  const [limit] = useState(4)
  const { courseId } = useParams();

  function paginateAndSearchTutors(tutors, page = 1, limit = 8, searchTerm = '') {
    // Filter tutors by search term
    const filteredTutors = tutors.filter(tutor =>
      (tutor.tutorId.fName + ' ' + tutor.tutorId.lName).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate total number of tutors
    const totalTutors = filteredTutors.length;

    // Calculate total number of pages
    const totalPages = Math.ceil(totalTutors / limit);

    // Paginate the filtered tutors
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTutors = filteredTutors.slice(startIndex, endIndex);

    return {
      tutors: paginatedTutors,
      totalTutors,
      totalPages,
      currentPage: page
    };
  }

  useEffect(() => {
    async function run() {
      let response = await axios.get(`/view-tutors?courseId=${courseId}`);

      let data = paginateAndSearchTutors(response.data[0].tutors)
      setData(response.data[0].courseId)
      setTutors(response.data[0].tutors);
      setFilteredTutors(data.tutors);
      setPages(data.totalPages)
    }
    run()
  }, [])




  //Search Function using Debounce
  const searchDebounce = debounce(async function (value) {

    try {
      setSearch(value);
      let data = paginateAndSearchTutors(tutors, undefined, undefined, value)
      setFilteredTutors(data.tutors);
      setPages(data.totalPages)
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


  const handelPageChange = async (data) => {
    try {
      let data2 = paginateAndSearchTutors(tutors, data.selected + 1)
      setFilteredTutors(data2.tutors);
      setPages(data2.totalPages)
    } catch (err) {
      console.log(err)
    }
  }

  console.log(data)
  return (


    <div className="content" style={{ marginTop: "22px" }}>
      <div className="det">
        <div className="info">
          <div className="breadCrumbs">
            <Link to="/">Home</Link> <span>&#62;</span>
            <Link to={`/course/${data._id}`}>Course Description</Link> <span>&#62;</span>
            <Link className="active">Tutor List</Link>
          </div>
          <h3>{data?.courseName}</h3>
          <h4>{data?.board}</h4>
          <p style={{ margin: "0" }}>Duration :- {data?.duration} months</p>

        </div>
      </div>
      <div className="search-options">
        <div className="inp">
          <input type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Type out the Course Name"
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>

      </div>
      <div className="course-list">
        {Array.isArray(filteredTutors) && (filteredTutors).length >= 1 ? (
          filteredTutors.map(tutor => (
            <Link to={`/course/${data._id}/${tutor.tutorId._id}`} className="part2-card" key={tutor.tutorId._id}>
              <div className="part2-card-img">
                <img
                  src={tutor.tutorId.profilePhoto}
                  alt=""
                />
              </div>
              <div className="part2-para">
                <div className="title">{tutor.tutorId.fName}{"  "}{tutor.tutorId.lName}</div>
                <p style={{ textAlign: "center" }}>
                  Experience:- {tutor.tutorId.expYear}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div style={{ gridColumn: "span 4", textAlign: "center", height: "fit-content" }}>
            <img style={{ width: "30%", margin: "auto" }} src="https://cdni.iconscout.com/illustration/premium/thumb/confused-woman-4937834-4105220.png" alt="" />
          </div>
        )}
      </div>

      <div className="course-pagination">
        <ReactPaginate
          previousLabel={<i className="fa-solid fa-hand-point-left"></i>}
          nextLabel={<i className="fa-solid fa-hand-point-right"></i>}
          pageCount={pages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={3}
          onPageChange={handelPageChange}
        />
      </div>
    </div>

  );
}

export default TutorList;
