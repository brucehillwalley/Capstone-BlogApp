import { Link } from "react-router-dom";
import { FaThumbsUp, FaRegEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAxios from "../service/useAxios";
import { useState } from "react";

export default function ActivityCard({ activity }) {
  const { currentUser } = useSelector((state) => state.user);
  const { axiosWithToken } = useAxios();
  const navigate = useNavigate();
  const [activityState, setActivityState] = useState(activity);

  const handleLike = async (activityId) => {
    try {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      //? kullanıcı daha önce like edip edemedigini kontrol ediyor
      const existingLike = await axiosWithToken.get(
        `/likes?filter[userId]=${currentUser._id}&filter[itemId]=${activityId}`
      );
      console.log(existingLike.data.data.length);

      if (existingLike.data.data.length > 0) {
        const res = await axiosWithToken.delete(
          `/likes/${existingLike.data.data[0]._id}`
        );
        // console.log(res.data == "");

        if (res.data == "") {
          setActivityState({
            ...activityState,
            likes: activityState.likes.filter(
              (like) => like !== currentUser._id
            ),
            likeCount: activityState.likeCount - 1,
          });
        }
      } else {
        const res = await axiosWithToken.post(`/likes/`, {
          userId: currentUser._id,
          itemId: activityId,
          itemType: "activity",
        });

        if (!res.data.error) {
          setActivityState({
            ...activityState,
            likes: [...activityState.likes, currentUser._id],
            likeCount: activityState.likeCount + 1,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleView = (activityId) => {
    setActivityState({
      ...activityState,
      views: activityState.views.push(currentUser._id),
    });
    navigate(`/activity/${activityId}`);
  };
  return (
    <div className="group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all">
      <Link to={`/activity/${activity._id}`}>
        <img
          src={activity.image}
          alt="activity cover"
          className="h-[260px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-lg font-semibold line-clamp-2">{activity.title}</p>
        <div className="flex justify-between">
          <span className="italic text-sm">{activity.categoryName}</span>
          <span className="italic text-sm">By, {activity.userId.username}</span>
          <span className="italic text-sm">
            {new Date(activity.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-center gap-10">
          <div className="flex gap-2 items-center">
            <button
              onClick={() => handleLike(activity._id)}
              //? conditional rendering for like // style koşulla sağlanmalı
              className={`${
                currentUser && activityState.likes?.includes(currentUser._id)
                  ? "!text-blue-500"
                  : "text-gray-400"
              }`}
            >
              <FaThumbsUp className="text-sm" />
            </button>
            <p className="text-gray-400">
              {activityState.likeCount > 0 &&
                activityState.likeCount +
                  " " +
                  (activityState.likeCount === 1 ? "like" : "likes")}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => handleView(activity._id)}
              //? conditional rendering for like // style koşulla sağlanmalı
              className={`${
                currentUser && activityState.views?.includes(currentUser._id)
                  ? "!text-blue-500"
                  : "text-gray-400"
              }`}
            >
              <FaRegEye className="text-md" />
            </button>
            <p className="text-gray-400">
              {activityState.viewCount > 0 &&
                activityState.viewCount +
                  " " +
                  (activityState.viewCount === 1 ? "view" : "views")}
            </p>
          </div>
        </div>
        <Link
          to={`/activity/${activity._id}`}
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2"
        >
          Read article
        </Link>
      </div>
    </div>
  );
}
