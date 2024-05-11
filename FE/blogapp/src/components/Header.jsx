import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import {useSelector, useDispatch} from "react-redux"
import {toggleTheme} from "../redux/theme/themeSlice"
import {logoutSuccess} from "../redux/user/userSlice"
import { useNavigate } from "react-router-dom"; 
import  useAxios  from "../service/useAxios";
import { useEffect, useState } from "react";


export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const dispatch = useDispatch();
  const {currentUser}  = useSelector((state) => state.user);
  const {theme} = useSelector((state) => state.theme);
  const {axiosWithToken} = useAxios();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleLogout = async () => {
    try {
      const res = await axiosWithToken.get("/auth/logout");
      if (res.error) {
        console.log(res.message);
      } else {
        dispatch(logoutSuccess());
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm) {
      return;
    }
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("search[content]", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }


  // console.log(currentUser);
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Gibra
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill onClick={() => dispatch(toggleTheme())}>
          {theme === "light" ? <FaSun/> : <FaMoon/>}
        
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/login'>
            <Button gradientDuoTone='purpleToBlue' outline>
              login
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
        <Navbar.Collapse>
        {/* navbarlink create anchor tag also Link create anchor tag that cause warning.
        To avoid it => as={'div'}  */}
            <Navbar.Link active={path === "/" } as={'div'}>
              <Link to="/">Home</Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/about"} as={'div'}>
              <Link to="/about">About</Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/blogs"} as={'div'}>
              <Link to="/blogs">Blogs</Link>
            </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  );
}
