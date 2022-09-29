import React, { useState, useEffect } from "react";
import "./User.css";
import site from "../../../assets/site.png";
import github from "../../../assets/github.png";
import location from "../../../assets/location.png";
import user from "../../../assets/user.png";
import { Link, useParams } from "react-router-dom";
import axios from "../../../axios";
import Repo from "../../ui/Repo";
const User = () => {
  const { login } = useParams();

  //UserInformation
  const [userInfo, setUserInfo] = useState({});
  //User repos
  const [repos, setRepos] = useState([]);


  const [currentpage, setCurrentPage] = useState(0)
  const [activepage, setActivetPage] = useState(0)
  const [perPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const pageNumbers = [];


  for (let i = 0; i<Math.ceil(repos.length)/perPage; i++){
    pageNumbers.push(i)
}

const handleChange = (e, pageno) => {
    //console.log("test")
    //console.log("pageno"+pageno)
    setCurrentPage(Math.ceil(repos.length/perPage));
    const selectedPage = pageno;
    setActivetPage(pageno);
    setOffset(selectedPage*perPage);


}

const slice = repos.slice(offset, offset + perPage)

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const response = await Promise.all([
          axios.get(`/users/${login}`),
          axios.get(`/users/${login}/repos`),
        ]);
        setUserInfo(response[0].data);
        setRepos(response[1].data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserInformation();
  }, []);
  return (
    <div className="container">
      <Link to="/" className="back">
        Back
      </Link>
      <div className="user-information">
        <div className="image">
          <img src={userInfo?.avatar_url} />
        </div>
        <div className="user-content">
          <h3>{userInfo?.name}</h3>
          <p>{userInfo?.bio}</p>
          <div className="more-data">
            <p>
              <img src={user} alt="" />
              {userInfo?.followers} Followers. Following {userInfo?.following}
            </p>
            {userInfo?.location && (
              <p>
                <img src={location} alt="" />
                {userInfo?.location}
              </p>
            )}
            {userInfo?.blog && (
              <p>
                <img src={site} alt="" />
                {userInfo?.blog}
              </p>
            )}
            <p>
              <img src={github} alt="" />
              <a href={userInfo?.html_url}>View GitHub Profile</a>
            </p>
          </div>
        </div>
      </div>
      
      <div className="user-repos">
        <div className="pagination">
         
            {/* <button onClick={handlePrevPage}>{page}</button>
            <button onClick={handleNextPage}>{page + 1}</button> */}
            {pageNumbers.map(page => (  
                    <button onClick={(event) => handleChange(event,page)}><span key={page} className={(page)==(activepage) ? 'page-link active' : 'page-link' }>  
                      {page+1}</span>
                      </button>
              ))} 
          </div>
        {repos ? (
          slice.map((repo) => {
            return <Repo repo={repo} key={repo.id} />;
          })
        ) : (
          <h3>repos not found...</h3>
        )}
      </div>
    </div>
  );
};

export default User;
