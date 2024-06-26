import { Alert, Button, Modal, TextInput, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import useAxios from "../service/useAxios";

export default function CommentSection({ activityId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();
  const { axiosWithToken, axiosPublic } = useAxios();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await axiosWithToken.post(`/comments/`, {
        userId: currentUser._id,
        comment,
        activityId,
      });
      console.log(res);

      if (!res.data.error) {
        setComment("");
        setCommentError(null);
        setComments([res.data.data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        //? login olmayan kullanıcılar yorum okuyabilir
        const res = await axiosPublic.get(
          `/comments?filter[activityId]=${activityId}&limit=1000`
        );
        // console.log(res.data.data);
        if (!res.data.error) {
          setComments(res.data.data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [activityId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      //? kullanıcı daha önce like edip edemedigini kontrol ediyor
      const existingLike = await axiosWithToken.get(
        `/likes?filter[userId]=${currentUser._id}&filter[itemId]=${commentId}`
      );
      // console.log(existingLike.data.data.length);

      if (existingLike.data.data.length > 0) {
        const res = await axiosWithToken.delete(
          `/likes/${existingLike.data.data[0]._id}`
        );
        // console.log(res.data == "");
     
  
        if (res.data == "") {
          setComments(
            comments.map((comment) =>
              comment._id === commentId
                ? {
                    ...comment,
                    likes: comment.likes.filter((like) => like !== currentUser._id),
                    likeCount: comment.likeCount - 1,
                  }
                : comment
            )
          );
        }
      } else {
        const res = await axiosWithToken.post(`/likes/`, {
          userId: currentUser._id,
          itemId: commentId,
          itemType: "comment",
        });

        if (!res.data.error) {
          setComments(
            comments.map((comment) =>
              comment._id === commentId
                ? {
                    ...comment,
                    likes: [...comment.likes, currentUser._id],
                    likeCount: comment.likeCount + 1,
                  }
                : comment
            )
          );
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, comment: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      const res = await axiosWithToken.delete(`/comments/${commentId}`);

      if (res.status === 204) {
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // console.log(comments[0].userId.username);
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be logged in to comment.
          <Link className="text-blue-500 hover:underline" to={"/login"}>
            Login
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDelete(commentToDelete)}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
