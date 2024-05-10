import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import useAxios from '../service/useAxios';

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');
  const [page, setPage] = useState(2);
  const { axiosWithToken } = useAxios();

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axiosWithToken.get(
          '/comments?sort[createdAt]=desc'
        )
        // console.log(res.data.data);
        if (!res.data.error) {
          setComments(res.data.data);
          if (res.data.data < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      getComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    try {
      const res = await axiosWithToken.get(
        `/comments?page=${page}`
      );

      if (!res.data.error) {
        setComments((prev) => [...prev, ...res.data.data]);
        setPage((prev) => prev + 1);
        // console.log(page);

        if (res.data.data.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await axiosWithToken.delete(
        `/comments/${commentIdToDelete}`
      )
      
      if (res.status === 204) {
        setComments(comments.map((comment) => comment._id === commentIdToDelete ? {...comment, isDeleted: true} : comment));
        setShowModal(false);
      } 
      if (res.status === 404) {
        console.log("not found");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className='divide-y' key={comment._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment.comment}</Table.Cell>
                  <Table.Cell>{comment.likeCount}</Table.Cell>
                  <Table.Cell>{comment.activityId}</Table.Cell>
                  <Table.Cell>{comment.userId._id}</Table.Cell>
                  <Table.Cell>{
                    comment.isDeleted ? (
                      <span className="font-medium text-gray-500">Deleted</span>
                    ):
                    ( <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>)
                  }
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no comments yet!</p>
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
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteComment}>
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