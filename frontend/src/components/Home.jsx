import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import Footer from './shared/Footer';
import { Avatar, AvatarImage } from './ui/avatar';
import Navbar from './shared/Navbar';
import { Search } from 'lucide-react';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { setSearchedQuery } from '@/redux/jobSlice';
import Chatbot from './ui/Chatbot';
import CompanyLogo from './CompanyLogo';
import SearchSuggestions from './SearchSuggestions';
import { setSearchCompanyByText } from '@/redux/companySlice';
import useGetRecommendations from '@/hooks/useGetRecommendations';

const HeroSection = () => {
  const [jobQuery, setJobQuery] = useState("");
  const [companyQuery, setCompanyQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState(""); 
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchHandler = () => {
    if (jobQuery) dispatch(setSearchedQuery(jobQuery));
    if (companyQuery) dispatch(setSearchCompanyByText(companyQuery));
    if (locationQuery) dispatch(setSearchedQuery(locationQuery));  
    navigate("/browse");
  };

  return (
    <div className='text-center'>
      <div className='flex flex-col gap-5 my-10'>
        <h1 className='text-5xl font-bold'>
          Find Your Dream Jobs<br />
          With <span className='text-[dodgerblue]'>Job Voyage</span>
        </h1>

        <div className="flex items-center w-[60%] mx-auto bg-white shadow-md rounded-full py-2 pl-4 pr-2 border border-gray-300">
          <Search className="h-5 w-5 text-gray-400" />

          <div className="relative w-full">
            <input
              type="text"
              placeholder="Enter role"
              value={jobQuery}
              onChange={(e) => setJobQuery(e.target.value)}
              className="outline-none border-none flex-grow text-gray-500 placeholder-gray-400 bg-transparent px-3"
            />
            <SearchSuggestions query={jobQuery} type="job" onSelect={setJobQuery} />
          </div>
          <div className="border-l border-gray-300 h-6"></div>

          <div className="relative w-full">
            <input
              type="text"
              placeholder="Enter company name"
              value={companyQuery}
              onChange={(e) => setCompanyQuery(e.target.value)}
              className="outline-none border-none text-gray-500 placeholder-gray-400 bg-transparent px-3"
            />
            <SearchSuggestions query={companyQuery} type="company" onSelect={setCompanyQuery} />
          </div>

          <div className="border-l border-gray-300 h-6"></div>

          <div className="relative w-full">
            <input
              type="text"
              placeholder="Enter location"
              value={locationQuery}  
              onChange={(e) => setLocationQuery(e.target.value)}
              className="outline-none border-none flex-grow text-gray-500 placeholder-gray-400 bg-transparent px-3"
            />
            <SearchSuggestions query={locationQuery} type="location" onSelect={setLocationQuery} /> 
          </div>

          <Button onClick={searchHandler} className="bg-blue-500 text-white px-5 py-2 rounded-full">
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

const LatestJobs = () => {
  const { allJobs } = useSelector(store => store.job);
  const { recommendedJobs, loading } = useSelector(store => store.job);

  return (
    <div className='max-w-6xl mx-auto my-20'>
      <h1 className='text-4xl font-bold'>
        <span className='text-[dodgerblue]'>Latest </span> Job Openings
      </h1>
      <div className='grid grid-cols-3 gap-4 my-5'>
        {Array.isArray(allJobs) && allJobs.length > 0 ? (
          allJobs.slice(0, 3).map((job) => <LatestJobCards key={job._id} job={job} />)
        ) : (
          <span>No Job Available</span>
        )}
      </div>

      <h1 className='text-4xl font-bold mt-10'>
        <span className='text-[dodgerblue]'>Personalized </span> Recommendations
      </h1>
      {loading ? (
        <p>Loading recommendations...</p>
      ) : Array.isArray(recommendedJobs) && recommendedJobs.length > 0 ? (
        <div className='grid grid-cols-3 gap-4 my-5'>
          {recommendedJobs.slice(0, 3).map((job) => <LatestJobCards key={job._id} job={job} />)}
        </div>
      ) : (
        <span>No personalized recommendations available</span>
      )}
    </div>
  );
};

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer'>
      <div className='flex items-center gap-2 my-2'>
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </Button>
        <div>
          <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
          <p className='text-sm text-gray-500'>{job?.location || 'India'}</p>
        </div>
      </div>
      <div>
        <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
        <p className='text-sm text-gray-600'>{job?.description}</p>
      </div>
      <div className='flex items-center gap-2 mt-4'>
        <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
        <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
        <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
      </div>
    </div>
  );
};

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  useGetRecommendations(); // Ensure this runs only when user is ready

  useEffect(() => {
    if (user?.role === 'Employer') {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  return (
    <div style={{ marginTop: '100px' }}>
      <Navbar />
      <HeroSection />
      <CompanyLogo />
      <LatestJobs />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Home;