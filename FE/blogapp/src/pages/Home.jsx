import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import ActivityCard from '../components/ActivityCard';
import  useAxios  from '../service/useAxios';

export default function Home() {
  const [activities, setActivities] = useState([]);
  const { axiosPublic } = useAxios();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axiosPublic('/activities?sort[createdAt]=desc');
      // console.log(res.data.data);
      setActivities(res.data.data);
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to Activity Blog</h1>
        <p className='text-gray-500 text-xs sm:text-xl'>
        Dive into a World of Exhilarating Activities: Explore, Experience, and Elevate
        </p>
        <Link
          to='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
        >
          View all posts
        </Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {activities && activities.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4'>
              {activities.map((activity) => (
                <ActivityCard key={activity._id} activity={activity} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}