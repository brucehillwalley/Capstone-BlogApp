import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { HiUser, HiArrowSmRight } from "react-icons/hi";

export default function DashSidebar() {
  return (
    <Sidebar>
    <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem active icon={HiUser} label={"User"} labelColor="dark">
                Profile
          </SidebarItem>
          <SidebarItem active icon={HiArrowSmRight} className='cursor-pointer'>
                Logout
          </SidebarItem>
     
        </SidebarItemGroup>

    </SidebarItems>
    
    
    </Sidebar>
  )
}

