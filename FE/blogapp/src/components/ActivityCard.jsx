import { Link } from 'react-router-dom';

export default function ActivityCard({ activity }) {
  return (
    <div className='group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all'>
      <Link to={`/activity/${activity._id}`}>
        <img
          src={activity.image}
          alt='activity cover'
          className='h-[260px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20'
        />
      </Link>
      <div className='p-3 flex flex-col gap-2'>
        <p className='text-lg font-semibold line-clamp-2'>{activity.title}</p>
        <div className='flex justify-between'>
        <span className='italic text-sm'>{activity.categoryName}</span>
        <span className='italic text-sm'>By, {activity.userId.username}</span>
        <span className='italic text-sm'>{new Date(activity.createdAt).toLocaleDateString()}</span>
        </div>
        <Link
          to={`/activity/${activity._id}`}
          className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
        >
          Read article
        </Link>
      </div>
    </div>
  );
}