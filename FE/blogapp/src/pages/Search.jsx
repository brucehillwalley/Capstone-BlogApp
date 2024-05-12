import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ActivityCard from "../components/ActivityCard";
import useAxios from "../service/useAxios";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const [page, setPage] = useState(2);
  const navigate = useNavigate();
  const { axiosPublic } = useAxios();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const { data } = await axiosPublic.get("/categories?limit=1000&pg=null");
      // console.log(data.data);
      setCategories(data.data);
    }

    getCategories()
  },[])

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("search[content]");
    const sortFromUrl = urlParams.get("sort[createdAt]");
    const categoryFromUrl = urlParams.get("filter[categoryName]");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl || "desc",
        category: categoryFromUrl || "uncategorized",
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await axiosPublic(`/activities?${searchQuery}`);
      // console.log(res.data);
      if (res.data.error) {
        setLoading(false);
        return;
      }
      if (!res.data.error) {
        const data = res.data;
        setPosts(data.data);
        setLoading(false);
        if (data.data.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData({ ...sidebarData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("search[content]", sidebarData.searchTerm);
    urlParams.set("sort[createdAt]", sidebarData.sort);
let searchQuery;
if(sidebarData.category !== "uncategorized"){
  urlParams.set('filter[categoryName]', sidebarData.category);
  searchQuery = urlParams.toString();
}else{
  urlParams.delete('filter[categoryName]');
  searchQuery = urlParams.toString();
  sidebarData.category="uncategorized";
}
    console.log(searchQuery);
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async() => {
    //? bulunduğum search query deki parametreleri al:
    const urlParams = new URLSearchParams(location.search);
    console.log(urlParams.toString());
    //? showmore için bir sonraki sayfayı getir:
    urlParams.set('page', page);
    const searchQuery = urlParams.toString();
    console.log(searchQuery);
    const res = await axiosPublic.get(`/activities?${searchQuery}`);
    console.log(res);
    if(res.data.error){
      return;
    }

   if (!res.data.error) {
    const data = res.data;
    setPosts((prev) => [...prev, ...data.data]);
    setPage((prev) => prev + 1);
    if (data.data.length < 9) {
      setShowMore(false);
    }
   }

  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex   items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Category:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id='category'
            >
              <option value='uncategorized'>Uncategorized</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 ">
          Posts results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => (
              <ActivityCard key={post._id} activity={post} />
            ))}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
