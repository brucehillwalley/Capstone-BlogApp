import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';
// import { set } from 'mongoose';
import useAxios from '../service/useAxios';

export default function Comment({ comment, onLike, onEdit, onDelete }) {
 
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.comment);
  const { currentUser } = useSelector((state) => state.user);
  const { axiosWithToken, axiosPublic } = useAxios();

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.comment);
   
  };

  const handleSave = async () => {
    try {
      const res = await axiosWithToken.put(`/comments/${comment._id}`, {
        comment: editedContent,
      })
      console.log(res.data);
      if (!res.data.false) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img
          className='w-10 h-10 rounded-full bg-gray-200'
          src={comment.userId.profilePicture}
          alt={comment.userId.username}
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
          <span className='font-bold mr-1 text-xs truncate'>
            {comment.userId.username ? `@${comment.userId.username}` : 'anonymous user'}
          </span>
          <span className='text-gray-500 text-xs'>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className='mb-2'
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className='flex justify-end gap-2 text-xs'>
              <Button
                type='button'
                size='sm'
                gradientDuoTone='purpleToBlue'
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type='button'
                size='sm'
                gradientDuoTone='purpleToBlue'
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className='text-gray-500 pb-2'>{comment.comment}</p>
            <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
              <button
                
                onClick={() =>  onLike(comment._id)}
             //? conditional rendering for like // style koşulla sağlanmalı
                className={`${
                  currentUser &&
                 comment.likes?.includes(currentUser._id) ?
                  '!text-blue-500' : 'text-gray-400'
                }`}
              >
                <FaThumbsUp className='text-sm' />
              </button>
              <p className='text-gray-400'>
                {comment.likeCount > 0 &&
                  comment.likeCount +
                    ' ' +
                    (comment.likeCount === 1 ? 'like' : 'likes')}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type='button'
                      onClick={handleEdit}
                      className='text-gray-400 hover:text-blue-500'
                    >
                      Edit
                    </button>
                    <button
                      type='button'
                      onClick={() => onDelete(comment._id)}
                      className='text-gray-400 hover:text-red-500'
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}