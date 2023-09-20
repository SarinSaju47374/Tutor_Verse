import {useState,useEffect} from 'react'
import {Link} from "react-router-dom"
import "../scss/elements/Navbar.scss"
function Navbar() {
  // Variable that handles few buttons in th ee NavBar
  const[showlist,setShowlist] = useState(false);
  const[showMoblist,setShowMoblist] = useState(false);
  const[courseList,setCourseList] = useState(false);
  

  //This is to handle the component when click outside navbar
  useEffect(() => {
    function handleClickOutside(event) {
      if ((showMoblist || courseList) && !event.target.closest('nav')) {
        setShowMoblist(false);
        setCourseList(false)
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMoblist,courseList]);


  //These Functions handles the buttons on navbar
  function handleSublist(){
    setShowlist(!showlist);
  }

  function handleMoblist(){
    setShowMoblist(!showMoblist);
  }

  function handleCourseList(){
    setCourseList(!courseList);
  }

  return (
    <nav>
      <div className="logo"><img src="../public/images/logo.png" alt="" /></div>
      <div className="list">
        <ul>
            <li><Link >Home</Link></li>
            <li><Link >Courses</Link><button onClick={handleCourseList}>{courseList ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}</button>
                <div className="sublist" style={{display:courseList?"flex":"none"}}>
                    <Link  >Course 1</Link>
                    <Link  >Course 1</Link>
                    <Link  >Course 1</Link>
                     
                </div>
            </li>
            <li><Link >Blogs</Link></li>
            <li><Link >About</Link></li>
            <li><Link >Login</Link></li>
        </ul>
      </div>
      <button className="admission">Admission</button>
      <button className="menu" onClick={handleMoblist}><i className="fa-solid fa-bars"></i></button>
      <div className="mob-list" style={{left:showMoblist?"0":"-100vw"}}>
        <ul>
                <li><Link >Home</Link></li>
                <li onClick={handleSublist}><Link >Courses</Link><button>{showlist ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}</button>
                    
                </li>
                <ul className="sublist" style={{display:showlist?"block":"none"}}>
                    <li><Link >Course 1</Link></li>
                    <li><Link >Course 2</Link></li>
                    <li><Link >Course 3</Link></li>
                    <li><Link >Course 4</Link></li>
                </ul>
                <li><Link >Blogs</Link></li>
                <li><Link >About</Link></li>
                <li><Link >Login</Link></li>
            </ul>
      </div>
    </nav>
  )
} 
export default Navbar  