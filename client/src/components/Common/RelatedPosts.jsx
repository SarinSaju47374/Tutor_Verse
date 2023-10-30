import { useState } from "react";
import { useNavigate } from "react-router-dom"
function RelatedPosts({data}) {
  const [modified,setModified] = useState(false);
  const navigate = useNavigate();

  const handleBlogClick = (id) => {
    console.log("BAM💣💣💣")

    navigate(`/blog/${id}`)
    setModified(!modified)
  }
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return (
    <div className="related-posts-section">
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
              </div>
            )
            :
            <div className="noBlog">No Blogs 🤔</div>
        }
    </div>
  )
}

export default RelatedPosts
