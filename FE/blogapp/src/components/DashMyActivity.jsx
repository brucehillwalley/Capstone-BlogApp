import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useAxios from "../service/useAxios";

export default function DashMyActivity() {
  const { currentUser } = useSelector((state) => state.user);
  const { axiosWithToken } = useAxios();
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "My Activity";
    // document.querySelector("meta[name='description']").content = "My Activity"
    // document.querySelector("meta[name='keywords']").content = "My Activity"
    const getActivities = async () => {
      try {
        const res = await axiosWithToken.get(
          `${import.meta.env.VITE_APP_BASE_URL}/activities?author=${
            currentUser._id
          }`
        );
        console.log(res.data);
        if (!res.data.error) {
          setActivities(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getActivities();
  }, []);

  return <div>DashMyActivity</div>;
}
