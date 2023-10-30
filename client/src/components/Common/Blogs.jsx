import { useState, useEffect } from "react";
import {Link} from "react-router-dom"
import axios from "../../axios"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import Swal from 'sweetalert2'
// import 'sweetalert2/src/sweetalert2.scss';


function Blogs() {
  const id = useSelector(state => state.tutor.user.id)
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const [data, setData] = useState([]);
  const [modified, setModified] = useState(false);
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
    
  let categoryNames = [
    "Technology", "Mathematics", "Language", "Education", "Money", "Pschycology"
  ]
  const searchDebounce = debounce(async function (value) {

    try {
      let response = await axios.get("/view-blog", {
        params: {
          id: id,
          searchQuery: value
        }
      })
      setData(response.data)


    } catch (error) {
      console.log(error)
      return false; // Return false in case of an error
    }

  }, 1000);
  useEffect(() => {
    async function run() {
      let response = await axios.get("/view-blog", {
        params: {
          id: id
        }
      })
      if (response.data) {
        setData(response.data)
      }
    }
    
    run()
  }, [modified])
  //The function that handles search input value 
  const handleChange = (event) => {
    const { value } = event.target;
    setValue(value)
    searchDebounce(value);
  };

  const handleCategory = async (event) => {
    const { value } = event.target;
    setCategory(value)
    try {
      let response = await axios.get("/view-blog", {
        params: {
          id: id,
          searchQuery: value
        }
      })
      setData(response.data)
    } catch (err) {
      console.log(err)
    }
  };

  const handleUpdate = (id, event) => {

    navigate(`/tutor/blogs/update/${id}`)
    event.stopPropagation();
  }

  const handleBlogClick = (id) => {
    navigate(`/tutor/blog/${id}`)
  }

  const handleDelete = (id,event)=>{
    event.stopPropagation();
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
          let response =  await axios.delete("/delete-blog",{
            params:{
              bid:id
            }
          })
          if(response.data.success){
            Swal.fire(
              'Deleted!',
              'The Blog has been deleted.',
              'success'
            )
          } 
          setModified(!modified)
        }else if (
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
  }
  return (
    <div className="blog-section-view">
      <div className="search">
        <div className="inp">
          <input type="text"
            value={value}
            onChange={handleChange}
            placeholder="Type out the Blog you are looking for?"
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
        <select
          name="category"
          id="blog-category"
          value={category}
          onChange={handleCategory}
        >
          <option value="" label="Choose the Category" disabled />
          {categoryNames.map((elem, index) => (
            <option value={elem} key={index}>{elem}</option>
          ))}
        </select>
        <Link to="/tutor/blog-create ">Create New Blog</Link>
      
      </div>
      <div className="blog-cards">
        {
          data?.blogs?.length > 0 ?
            data?.blogs.map((elem, index) =>
              <div className="blog-card" key={index} onClick={() => handleBlogClick(elem._id)}>
                <div className="blog-author">
                  <img
                    src={elem.author.profilePhoto}
                    alt=""
                  />
                </div>
                <div className="blog-card-img">
                  <img
                    src={elem.image}
                    alt=""
                  />
                </div>
                <div className="blog-para">
                  <div className="title">{elem.title}</div>
                  <p>
                    Author: {elem.author.fName}{" "}{elem.author.lName}
                  </p>
                  <p>
                    Posted: {new Date(elem.updatedAt).toLocaleDateString(undefined, options)}
                  </p>
                </div>
                <div className="actions">
                  <i className="fa-solid fa-trash" onClick={(event)=>handleDelete(elem._id,event)}></i>
                  <i className="fa-solid fa-pen-to-square" onClick={(event) => handleUpdate(elem._id, event)}></i>
                </div>
              </div>
            )
            :
            <div className="noBlog">No Blogs 🤔</div>
        }
      </div>
    </div>
  )
}

export default Blogs;
