import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { setSearchCompanyByText } from '@/redux/companySlice';

const Browse = () => {
    useGetAllJobs();
    const dispatch = useDispatch();

    // Retrieve job list and company search text from Redux store
    const { allJobs } = useSelector(store => store.job);
    const { searchCompanyByText } = useSelector(store => store.company);

    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        };
    }, [dispatch]);
   
    // Filter jobs by company name
    const filteredJobs = allJobs.filter(job =>
        job.company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase())
    );
    

    return (
        <div style={{ marginTop: '100px' }}>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <h1 className='font-bold text-xl my-10'>Search Results ({filteredJobs.length})</h1>
                <div className='grid grid-cols-3 gap-4'>
                    {
                        filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <Job key={job._id} job={job} />
                            ))
                        ) : (
                            <span>No jobs available</span>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Browse;
