import axios from "axios";
import { useSelector } from "react-redux";

const useAxios = () => {
  const { token } = useSelector((state) => state.user);

  const axiosWithToken = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    headers: {
      Authorization: `Token ${token}`
      // Authorization: `Bearer ${token}`,
    },
  });
  const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
   
  });



  return { axiosWithToken, axiosPublic };
};

export default useAxios;
