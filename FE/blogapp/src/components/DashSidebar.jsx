import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import {
  HiUser,
  HiLogout,
  HiChartPie,
  HiSparkles,
  HiOutlineUserGroup,
  HiAnnotation,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAxios from "../service/useAxios";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const { axiosWithToken } = useAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

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
        <SidebarItemGroup className="flex flex-col gap-1">
          {/* // User Panel */}
          <Link to="/dashboard?tab=dash">
            <Sidebar.Item
              active={tab === "dash" || !tab}
              icon={HiChartPie}
              as="div"
            >
              Dashboard
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=profile">
            <SidebarItem
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </SidebarItem>
          </Link>
          <Link to="/dashboard?tab=myactivities">
            <SidebarItem
              active={tab === "myactivities"}
              icon={HiSparkles}
              labelColor="dark"
              as="div"
            >
              My Posts
            </SidebarItem>
          </Link>
          {/* // Admin Panel */}
          {currentUser.isAdmin && (
            <>
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  as="div"
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=activities">
                <SidebarItem
                  active={tab === "activities"}
                  icon={HiSparkles}
                  labelColor="dark"
                  as="div"
                >
                 User Posts
                </SidebarItem>
              </Link>
              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={HiAnnotation}
                  as="div"
                >
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          )}
          <SidebarItem
            active={tab === "logout"}
            icon={HiLogout}
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
