import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import ActivityCard from "../components/ActivityCard";
import useAxios from "../service/useAxios";
import CommentSection from "../components/CommentSection";

export default function ActivityPage() {
  const { actId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activity, setActivity] = useState(null);
  const [recentActivities, setRecentActivities] = useState(null);
  const { axiosWithToken, axiosPublic } = useAxios();

  useEffect(() => {
    const getActivity = async () => {
      try {
        setLoading(true);
        const res = await axiosWithToken.get(`/activities/${actId}`);
        console.log(res.data.data);
        if (!res.data.error) {
          setActivity(res.data.data);
          setLoading(false);
        }

        if (res.data.error) {
          setError(true);
          setLoading(false);
          // return;
        }
      } catch (error) {
        setError(true);
        setLoading(false);
        console.log(error.message);
      }
    };
    getActivity();
  }, []);

  useEffect(() => {
    try {
      const getRecentActivities = async () => {
        const res = await axiosPublic.get(
          `/activities?sort[createdAt]=desc&limit=3`
        );
        // console.log(res.data);
        if (!res.data.error) {
          setRecentActivities(res.data.data);
        }
      };
      getRecentActivities();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" color="pink" />
      </div>
    );
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {activity && activity.title}
      </h1>
      <Link
        to={`/search?categoryName=${activity && activity.categoryName}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {activity && activity.categoryName}
        </Button>
      </Link>
      <div className="">
        <div className="flex items-center justify-end gap-2 mx-auto w-full max-w-2xl text-xs ">
          <span className="italic">
           Authored By, {activity && activity.userId.username}
          </span>
          <img
            src={activity.userId.profilePicture}
            alt={activity.userId.username}
            className="w-10 h-10 object-cover bg-gray-500 rounded-full "
          />
        </div>
        <img
          src={activity && activity.image}
          alt={activity && activity.title}
          className="mt-3 p-3 max-h-[600px] w-full object-cover"
        />
      </div>
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>
          {activity && new Date(activity.createdAt).toLocaleDateString()}
        </span>
        {/* <span className="italic">
          By, {activity && activity.userId.username}
        </span> */}
        <span className="italic">
          {activity && (activity.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full activity-content"
        dangerouslySetInnerHTML={{ __html: activity && activity.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection activityId={activity._id} />

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentActivities &&
            recentActivities.map((activity) => (
              <ActivityCard key={activity._id} activity={activity} />
            ))}
        </div>
      </div>
    </main>
  );
}
