import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState([]); 

    useEffect(() => {
        if (Array.isArray(allJobs)) {
            if (searchedQuery) {
                const filteredJobs = allJobs.filter((job) => {
                    return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                        job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                        job.location.toLowerCase().includes(searchedQuery.toLowerCase());
                });
                setFilterJobs(filteredJobs);
            } else {
                setFilterJobs(allJobs);
            }
        } else {
            setFilterJobs([]);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div style={{ marginTop: '100px' }}>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5 mx-auto max-w-6xl h-16'>
                    <div className='w-20%'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? <span>Job not found</span> : (
                            <div className='grid grid-cols-3 gap-4'>
                                {
                                    filterJobs.map((job) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: 100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ duration: 0.3 }}
                                            key={job?._id}>
                                            <Job job={job} />
                                        </motion.div>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Jobs;
