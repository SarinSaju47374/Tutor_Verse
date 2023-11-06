import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import "../../scss/screen/Student/Home.scss";
import axios from "../../axios";

// import swiper from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';


function Home({ loggedIn }) {
    const [slidesPerView, setSlidesPerView] = useState(window.innerWidth <= 768 ? 1 : 3);
    const [courses, setCourses] = useState([])

    useEffect(() => {
        const handleResize = () => {
            setSlidesPerView(window.innerWidth <= 768 ? 1 : 3);
        };

        window.addEventListener('resize', handleResize);
        async function run() {
            const limit = 6;
            let response = await axios.get(`/course-view?limit=${limit}`);
            setCourses(response.data.courses);
        }
        run()
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    console.log({ courses })
    return (

        <div className="content">
            <div className="part1">
                <div className="part1-left">
                    <h3>WELCOME TO </h3>
                    <h2>TUTORVERSE</h2>
                    <p>Looking for Tutors?</p>
                    <p>Students can choose there Tutor of choice.</p>
                    <ul>
                        <li> <i className="fa-regular fa-circle-check"></i> Expert and verified tutors </li>
                        <li> <i className="fa-regular fa-circle-check"></i> One to One Session</li>
                        <li> <i className="fa-regular fa-circle-check"></i> Unique Perspective on Courses</li>
                    </ul>
                    <div className="options">
                        {loggedIn ?
                            <div className="option">
                                Courses
                                <Link style={{ width: "10rem" }}>
                                    <i className="fa-solid fa-chalkboard-user"></i>
                                    CheckOut Courses
                                </Link>
                            </div>
                            :
                            <>
                                <div className="option">
                                    Join as a Tutor
                                    <Link to="/tutor/register">
                                        <i className="fa-solid fa-chalkboard-user"></i>
                                        Start Teaching
                                    </Link>
                                </div>
                                <div className="option">
                                    Join as a Student
                                    <Link to="/student/register">
                                        <i className="fa-solid fa-chalkboard-user"></i>
                                        Start Learning
                                    </Link>
                                </div>
                                <div className="option">
                                    Checkout the Courses
                                    <Link to="/courses">
                                        <i className="fa-solid fa-chalkboard-user"></i>
                                        Courses
                                    </Link>
                                </div>

                            </>

                        }
                    </div>
                </div>
                <div className="part1-right">
                    <img src="/images/homepart1.png" alt="" />
                </div>
            </div>

            <div className="part2">
                <div className="part-title">
                    Start Learning
                </div>
                <div className="part2-head">
                    The unique Learning Experience with Our Tutors
                </div>
                <div className="part2-col">
                    <div className="part2-card">
                        <div className="part2-card-img">
                            <img src="https://bookmytutor.com/store/images/new/safe.webp" alt="" />
                        </div>
                        <div className="part2-para">
                            <div className="title">
                                We care about your Safety and Privacy
                            </div>
                            <p>
                                All of our tutors go through a rigorous background check and screening process before joining us. We accept less than 3% of all applicants.
                            </p>
                        </div>
                    </div>
                    <div className="part2-card">
                        <div className="part2-card-img">
                            <img src="https://bookmytutor.com/store/images/new/teacher1.webp" alt="" />
                        </div>
                        <div className="part2-para">
                            <div className="title">
                                Learn from world-class experts
                            </div>
                            <p>
                                We only recruit tutors of the highest quality. All our professional tutors are experienced, knowledgeable, professional, and patient.
                            </p>
                        </div>
                    </div>
                    <div className="part2-card">
                        <div className="part2-card-img">
                            <img src="https://bookmytutor.com/store/images/new/easy.webp" alt="" />
                        </div>
                        <div className="part2-para">
                            <div className="title">
                                We care about your success
                            </div>
                            <p>
                                Our tutors will make personalized tutoring plans based on your needs to make sure you are making progress towards your goals.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="part3">
                <div className="part-title">
                    Courses
                </div>
                <div className="part3-head">
                    Checkout the Following Courses
                </div>
                <div className="part3-col">
                    {courses?.length > 0 && courses.map((ele, ind) =>
                        <Link key={ind} to={`/course/${ele._id}`}>
                            <div className="part-card">
                                <div className="part-card-img">
                                    <img src={ele.image} alt="" />
                                </div>
                                <div className="part-para">
                                    <div className="title">
                                        {ele.courseName}
                                    </div>
                                    <p>
                                        {ele.desc}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
            {/* <div className="part4">
                <div className="part-title">
                    Start Learning
                </div>
                <div className="part3-head">
                    Enchance your skills with our best tutors
                </div>
                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    slidesPerView={slidesPerView}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    pagination={{

                    }}

                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper"
                >
                    <SwiperSlide>
                        <div className="review">
                            <i className="fa-solid fa-quote-left"></i>
                            <i className="fa-solid fa-quote-right"></i>
                            <div className="photo">
                                <img src="https://kidcitystores.com/cdn/shop/files/colle-1.jpg?v=1668766002&width=535" alt="" />
                            </div>
                            <div className="para">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt possimus ratione ipsam?</div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="review">
                            <i className="fa-solid fa-quote-left"></i>
                            <i className="fa-solid fa-quote-right"></i>
                            <div className="photo">
                                <img src="https://kidcitystores.com/cdn/shop/files/colle-1.jpg?v=1668766002&width=535" alt="" />
                            </div>
                            <div className="para">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt possimus ratione ipsam?</div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="review">
                            <i className="fa-solid fa-quote-left"></i>
                            <i className="fa-solid fa-quote-right"></i>
                            <div className="photo">
                                <img src="https://kidcitystores.com/cdn/shop/files/colle-1.jpg?v=1668766002&width=535" alt="" />
                            </div>
                            <div className="para">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt possimus ratione ipsam?</div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="review">
                            <i className="fa-solid fa-quote-left"></i>
                            <i className="fa-solid fa-quote-right"></i>
                            <div className="photo">
                                <img src="https://kidcitystores.com/cdn/shop/files/colle-1.jpg?v=1668766002&width=535" alt="" />
                            </div>
                            <div className="para">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt possimus ratione ipsam?</div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="review">
                            <i className="fa-solid fa-quote-left"></i>
                            <i className="fa-solid fa-quote-right"></i>
                            <div className="photo">
                                <img src="https://kidcitystores.com/cdn/shop/files/colle-1.jpg?v=1668766002&width=535" alt="" />
                            </div>
                            <div className="para">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt possimus ratione ipsam?</div>
                        </div>
                    </SwiperSlide>


                </Swiper>

            </div> */}
            {/* <div className="part3">
                <div className="part-title">
                    Start Learning
                </div>
                <div className="part3-head">
                    Enchance your skills with our best tutors
                </div>
                <div className="part3-col">
                    <div className="part-card">
                        <div className="part-card-img">
                            <img src="https://bookmytutor.com/store/images/new/safe.webp" alt="" />
                        </div>
                        <div className="part-para">
                            <div className="title">
                                Class 7th Maths
                            </div>
                            <p>
                                Class 7th Math RS AGGARWAL a detail
                            </p>
                        </div>
                    </div>
                    <div className="part-card">
                        <div className="part-card-img">
                            <img src="https://bookmytutor.com/store/images/new/safe.webp" alt="" />
                        </div>
                        <div className="part-para">
                            <div className="title">
                                Class 7th Maths
                            </div>
                            <p>
                                Class 7th Math RS AGGARWAL a detail
                            </p>
                        </div>
                    </div>
                    <div className="part-card">
                        <div className="part-card-img">
                            <img src="https://bookmytutor.com/store/images/new/safe.webp" alt="" />
                        </div>
                        <div className="part-para">
                            <div className="title">
                                Class 7th Maths
                            </div>
                            <p>
                                Class 7th Math RS AGGARWAL a detail
                            </p>
                        </div>
                    </div>
                    <div className="part-card">
                        <div className="part-card-img">
                            <img src="https://bookmytutor.com/store/images/new/safe.webp" alt="" />
                        </div>
                        <div className="part-para">
                            <div className="title">
                                Class 7th Maths
                            </div>
                            <p>
                                Class 7th Math RS AGGARWAL a detail
                            </p>
                        </div>
                    </div>
                    <div className="part-card">
                        <div className="part-card-img">
                            <img src="https://bookmytutor.com/store/images/new/safe.webp" alt="" />
                        </div>
                        <div className="part-para">
                            <div className="title">
                                Class 7th Maths
                            </div>
                            <p>
                                Class 7th Math RS AGGARWAL a detail
                            </p>
                        </div>
                    </div>
                    <div className="part-card">
                        <div className="part-card-img">
                            <img src="https://bookmytutor.com/store/images/new/safe.webp" alt="" />
                        </div>
                        <div className="part-para">
                            <div className="title">
                                Class 7th Maths
                            </div>
                            <p>
                                Class 7th Math RS AGGARWAL a detail
                            </p>
                        </div>
                    </div>
                    <div className="part-card">
                        <div className="part-card-img">
                            <img src="https://bookmytutor.com/store/images/new/safe.webp" alt="" />
                        </div>
                        <div className="part-para">
                            <div className="title">
                                Class 7th Maths
                            </div>
                            <p>
                                Class 7th Math RS AGGARWAL a detail
                            </p>
                        </div>
                    </div>
                    <div className="part-card">
                        <div className="part-card-img">
                            <img src="https://bookmytutor.com/store/images/new/safe.webp" alt="" />
                        </div>
                        <div className="part-para">
                            <div className="title">
                                Class 7th Maths
                            </div>
                            <p>
                                Class 7th Math RS AGGARWAL a detail
                            </p>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default Home
