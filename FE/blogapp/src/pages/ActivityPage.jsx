import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from '../components/CallToAction';
// import CommentSection from '../components/CommentSection';
// import activityCard from '../components/activityCard';
import useAxios from "../service/useAxios";
import CommentSection from "../components/CommentSection";

export default function ActivityPage() {

  const { actId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activity, setActivity] = useState(null);
  const [recentActivities, setRecentactivities] = useState(null);
  const { axiosWithToken } = useAxios();

  useEffect(() => {
    const fetchactivity = async () => {
      try {
        setLoading(true);
        const res = await axiosWithToken.get(`/activities/${actId}`);
        // console.log(res.data.data);
        if (!res.data.error) {
          setActivity(res.data.data);
          setLoading(false);
        }

        if (res.data.error) {
          setError(true);
          setLoading(false);
          return;
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchactivity();
  }, [actId]);

  useEffect(() => {
    try {
      const fetchRecentactivitys = async () => {
        const res = await fetch(`/api/activity/getactivitys?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentactivitys(data.activitys);
        }
      };
      //   fetchRecentactivitys();
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
      <img
        src={activity && activity.image}
        alt={activity && activity.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>
          {activity && new Date(activity.createdAt).toLocaleDateString()}
        </span>
        <span className="italic">
          {activity && (activity.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full activity-content"
        dangerouslySetInnerHTML={{ __html: activity && activity.content }}
      ></div>
      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>
      <CommentSection activityId={activity._id} />

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {/* {recentactivitys &&
            recentactivitys.map((activity) => <activityCard key={activity._id} activity={activity} />)} */}
        </div>
      </div>
    </main>
  );
}
