import React, { useState, useEffect } from "react";
import "./Home.css";
import axios from "../../../axios";
import User from "../../ui/User";
import Repo from "../../ui/Repo"
const Home = () => {
  const [query, setQuery] = useState("");
  //Users fetched from the API
  const [users, setUsers] = useState([]);
  //Page
  const [page, setPage] = useState(1);
  //Per page
  const [limit, setLimit] = useState(100);

  const [currentpage, setCurrentPage] = useState(0)
  const [activepage, setActivetPage] = useState(0)
  const [perPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const pageNumbers = [];
  const [message, setmessage] = useState("");
  const [loader, setLoader] = useState(0);


  for (let i = 0; i<Math.ceil(users.length)/perPage; i++){
    pageNumbers.push(i)
}

const handleChange = (e, pageno) => {
    //console.log("test")
    //console.log("pageno"+pageno)
    setCurrentPage(Math.ceil(users.length/perPage));
    const selectedPage = pageno;
    setActivetPage(pageno);
    setOffset(selectedPage*perPage);


}

const slice = users.slice(offset, offset + perPage)

  const handleQueryInput = (e) => {
    setmessage("");
    const value = e.target.value;
    setQuery(value);
  };
  const handlePrevPage = () => {
    setPage((page) => {
      if (page === 1) return page;
      else return page - 1;
    });
  };

  const handleNextPage = () => {
    setPage((page) => page + 1);
  };

  const handlePageLimit = (e) => {
    const value = e.target.value;
    setLimit(parseInt(value));
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/search/users?q=" + query, {
        params: {
          page,
          per_page: limit,
        },
      });
      return data?.items;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleSearchUsers = async (e) => {
    setLoader(1)
    e.preventDefault();
    //console.log("ssss")
    if (query) {
      
      const items = await fetchUsers();
      if(items)
      {
        setLoader(0)
      }
      setUsers(items);
    } else {
      //console.log("Your query is empty...");
      setmessage("Please enter name...");
    }
  };

  useEffect(() => {
    const displayUsersOnChange = async () => {
      if (query) {
        const items = await fetchUsers();
        setUsers(items);
      }
    };
    displayUsersOnChange();
  }, [page, limit]);

  return (
    <div className="container">
      <div className="search-form">
        <h2>GitHub Search</h2>
        <form>
          <input value={query} onChange={handleQueryInput} type="text" />
          <button onClick={handleSearchUsers}>Search</button>
          
        </form>
        <span>{message}</span>
      </div>
      {loader==1 ? <div className="lds-spinner">Loading...<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> : '' }
      <div className="search-results">
        <div className="more-options">
         
          <div className="pagination">
         
            {pageNumbers.map(page => (  
                    <button onClick={(event) => handleChange(event,page)}><span key={page} className={(page)==(activepage) ? 'page-link active' : 'page-link' }>  
                      {page+1}</span>
                      </button>
              ))} 
          </div>
          
        </div>
        {slice ? (
          slice.map((user) => {
            return <User user={user} key={user.id} />;
          })
        ) : (
          <h4>
            No data
          </h4>
        )}
      </div>
    </div>
  );
};

export default Home;
