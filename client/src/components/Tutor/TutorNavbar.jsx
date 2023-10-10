import {useState,useEffect} from 'react'
import {Link} from "react-router-dom"
import styles from "../../scss/components/Student/Navbar.module.scss"  

function TutorNavbar({loggedIn}) {
  // Variable that handles few buttons in th ee NavBar
  const[showlist,setShowlist] = useState(false);
  const[showMoblist,setShowMoblist] = useState(false);
  const[courseList,setCourseList] = useState(false);
  const[loginList,setLoginList] = useState(false);
  
  

  //This is to handle the component when click outside navbar
  useEffect(() => {
    function handleClickOutside(event) {
      if ((showMoblist || courseList || loginList) && !event.target.closest('nav')) {
        setShowMoblist(false);
        setCourseList(false);
        setLoginList(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMoblist,courseList,loginList]);


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

  function handleLoginList(){
    setLoginList(!loginList);
  }

  return (
    <nav className={styles.userNav}>
      <div className={styles.logo}><img src="/images/tutorverse cyan logo.png" alt="" /></div>
      <div className={styles.list}>
        <ul>
            <li><Link to="/tutor">Home</Link></li>
            
            <li><Link>Blogs</Link></li>
            <li><Link to="/tutor/profile">Profile</Link></li>   
           
            
             
            <li><Link to="/tutor/login">Logout</Link></li>
 
        </ul>
      </div>
       
        <button className={styles.admission}><i className="fa-solid fa-list-ul"></i>  Check Your Notifications</button>  
        
     
      <button className={styles.menu} onClick={handleMoblist}><i className="fa-solid fa-bars"></i></button>
      <div className={styles.mobList} style={{left:showMoblist?"0":"-100vw"}}>
        <ul>
                <li><Link >Home</Link></li>
                <li onClick={handleSublist}><Link >Courses</Link><button>{showlist ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}</button>
                </li>
                <ul className={styles.sublist} style={{display:showlist?"block":"none"}}>
                    <li><Link >Course 1</Link></li>
                    <li><Link >Course 2</Link></li>
                    <li><Link >Course 3</Link></li>
                    <li><Link >Course 4</Link></li>
                </ul>
                <li><Link >Blogs</Link></li>
                {loggedIn?
                    <li><Link >Logout</Link></li>
                    :
                    <>
                      <li onClick={handleLoginList}><Link >Login</Link><button>{loginList ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}</button>
                      </li>
                      <ul className={styles.sublist} style={{display:loginList?"block":"none"}}>
                          <li><Link >Student Login</Link></li>
                          <li><Link >Tutor Loginin</Link></li>
                      </ul>
                    </>
                }
                 
                <li><Link to="/tutor/profile">Check Bookings</Link></li>
                    
            </ul>
      </div>
    </nav>
  )
} 
export default TutorNavbar  