import useAxios from "../service/useAxios";
export default function Home() {
  //? data control
  // const { axiosWithToken, axiosPublic } = useAxios();
  // const asyncFunction = async () => {
  //   const data = await axiosWithToken.get('/users');
  //   console.log(data.data);
  // } 
  // asyncFunction();
  return <div className="text-3xl text-red-500">Home</div>;
}
