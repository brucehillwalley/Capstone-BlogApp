import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { HiUser, HiArrowSmRight } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import  useAxios  from "../service/useAxios";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";


export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const { axiosWithToken } = useAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
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
  return (
    <Sidebar className="w-full md:56">
      <SidebarItems>
        <SidebarItemGroup>
          <Link to="/dashboard?tab=profile">
            <SidebarItem
              active={tab === "profile"}
              icon={HiUser}
              label={"User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </SidebarItem>
          </Link>
          <SidebarItem
            active={tab === "logout"}
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
