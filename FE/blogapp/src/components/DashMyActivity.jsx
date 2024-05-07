import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
// import { set } from 'mongoose';
import useAxios from "../service/useAxios";

export default function DashMyActivity() {
  const { currentUser } = useSelector((state) => state.user);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [page, setPage] = useState(2);
  const { axiosWithToken } = useAxios();
  const [activitiesState, setActivitiesState] = useState([]);
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

        // console.log(res.data.data);
        if (!res.data.error) {
            setActivitiesState(res.data.data);
          //   console.log(activities.length);
          if (res.data.data.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getActivities();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    try {
      const res = await axiosWithToken.get(
        `${import.meta.env.VITE_APP_BASE_URL}/activities?author=${
          currentUser._id
        }&page=${page}`
      );

      if (!res.data.error) {
        setActivitiesState((prev) => [...prev, ...res.data.data]);
        setPage((prev) => prev + 1);
        console.log(page);
        
        if (res.data.data.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {activitiesState.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span className="">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {activitiesState.map((activity) => (
              <Table.Body key={activity._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(activity.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/activity/${activity.slug}`}>
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/activity/${activity.slug}`}
                    >
                      {activity.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {/* TODO: backend e populate yap */}
                    {activity.categoryName}
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-medium text-red-500 hover:underline cursor-pointer">
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500"
                      to={`/update-activity/${activity._id}`}
                    >
                      <span className="hover:underline">Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
    </div>
  );
}
