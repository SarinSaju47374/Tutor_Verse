import "../../scss/components/Student/Footer.scss";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer">
      <div className="part1">
        <div className="footer-main-section footer-section">
          <div className="logo">
            <img src="/images/tutorverse cyan logo.png" alt="" />
          </div>
          <div className="footer-main-lnks">
            <h4>We are on</h4>
            <div className="social-lnks">
              <div className="social-lnk">
                <Link>
                  <img
                    src="https://www.pngitem.com/pimgs/m/504-5043553_whats-app-whatsapp-logo-png-transparent-png.png"
                    alt=""
                  />
                </Link>
              </div>
              <div className="social-lnk">
                <Link>
                  <img
                    src="https://freelogopng.com/images/all_img/1658587303instagram-png.png"
                    alt=""
                  />
                </Link>
              </div>
              <div className="social-lnk">
                <Link>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/LinkedIn_icon_circle.svg/800px-LinkedIn_icon_circle.svg.png"
                    alt=""
                  />
                </Link>
              </div>
              <div className="social-lnk">
                <Link>
                  <img
                    src="https://png.pngtree.com/png-vector/20221018/ourmid/pngtree-twitter-social-media-round-icon-png-image_6315985.png"
                    alt=""
                  />
                </Link>
              </div>
              <div className="social-lnk">
                <Link>
                  <img
                    src="https://img.freepik.com/premium-vector/youtube-logo-circle-red-social-media-logo_197792-4982.jpg"
                    alt=""
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-section">
          <div className="footer-title">Know Us</div>
          <div className="footer-title-lnks">
            <Link to="/about-us">About Us</Link>
            <Link to="/contact-us">Contact Us</Link>
            <Link to="/courses">Courses</Link>           
          </div>
        </div>
        <div className="footer-section">
          <div className="footer-title">Explore</div>
          <div className="footer-title-lnks">
            <Link to="/">Home</Link>
            <Link to="/blogs">Blogs</Link>
            <Link to="/student/login">Login As Student</Link>  
            <Link to="/tutor/login">Login As Tutor</Link>  
          </div>
        </div>
        <div className="footer-section">
          <div className="footer-title">Registration</div>
          <div className="footer-title-lnks">
            <Link to="/student/register">Register As Student</Link>
            <Link to="/tutor/register">Regiser As Tutor</Link>
          </div>
        </div>
      </div>
      <div className="part2">
        <p>&#169; 2023. Developed by Sarin Saju. All Right Reserved</p>
        <div className="terms">
            <Link>Terms & Conditions</Link>
            <Link>Privacy Policy</Link>
            <Link>Refund & Cancellation Policy</Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
