import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import useAxios from "../service/useAxios";

export default function DashMyActivity() {
  const { currentUser } = useSelector((state) => state.user);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [page, setPage] = useState(2);
  const { axiosWithToken, axiosPublic } = useAxios();
  const [activitiesState, setActivitiesState] = useState([]);

  const getActivities = async () => {
    try {
      const res = await axiosWithToken.get(
          `/activities`
      )

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

  useEffect(() => {
    // window.scrollTo(0, 0);
    document.title = "Users' Posts";
    //? Set Meta Tags For SEO
    // document.querySelector("meta[name='title']").content = "My Activity"
    // document.querySelector("meta[name='description']").content = "My Activity"
    // document.querySelector("meta[name='keywords']").content = "My Activity"
    
    getActivities();
  }, []);

  const handleShowMore = async () => {
    try {
      const res = await axiosPublic.get(
        `activities?page=${page}`
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

  const handleDeleteActivity = async () => {
    setShowModal(false);
        try {
            const res = await axiosWithToken.delete(
                `${import.meta.env.VITE_APP_BASE_URL}/activities/${postIdToDelete}`
              )
            //   console.log(res.status===204);
              if(res.status===204){
                getActivities();
              }
              if(res.status===404){
                console.log("not found");
              }

        } catch (error) {
            console.log(error.message);
        }
     



  }

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
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {activitiesState.map((activity) => (
              <Table.Body key={activity._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(activity.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/activity/${activity._id}`}>
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
                      to={`/activity/${activity._id}`}
                    >
                      {activity.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {/* TODO: backend e populate yap */}
                    {activity.categoryName}
                  </Table.Cell>
                  <Table.Cell>
                    {activity.isDeleted ? (
                      <span className="font-medium text-gray-500">Deleted</span>
                    ) : (
                      <span className="font-medium  text-red-500 hover:underline cursor-pointer"
                        onClick={() => {
                            setShowModal(true)
                            setPostIdToDelete(activity._id)
                            
                            }}>
                        Delete
                      </span>
                    )}
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
      
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this post?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteActivity}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
