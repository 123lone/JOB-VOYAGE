import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Eye } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const [filterJobs, setFilterJobs] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === 'Employer') {
            const employerJobs = allAdminJobs.filter((job) => job.created_by === user._id);

            const filteredJobs = employerJobs.filter((job) => {
                if (!searchJobByText) {
                    return true;
                }
                return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
                    job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase());
            });

            setFilterJobs(filteredJobs);
        }
    }, [allAdminJobs, searchJobByText, user]);

    return (
        <div>
            <Table>
                <TableCaption>A list of your recently posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead style={{ backgroundColor: '#bbdefb', color: 'black', padding: '10px', textAlign: 'left' }}>Company Name</TableHead>
                        <TableHead style={{ backgroundColor: '#bbdefb', color: 'black', padding: '10px', textAlign: 'left' }}>Role</TableHead>
                        <TableHead style={{ backgroundColor: '#bbdefb', color: 'black', padding: '10px', textAlign: 'left' }}>Location</TableHead>
                        <TableHead style={{ backgroundColor: '#bbdefb', color: 'black', padding: '10px', textAlign: 'left' }}>Date</TableHead>
                        <TableHead style={{ backgroundColor: '#bbdefb', color: 'black', padding: '10px', textAlign: 'left' }}>Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {
                        filterJobs?.map((job) => (
                            <TableRow key={job._id}>
                                <TableCell>{job?.company?.name}</TableCell>
                                <TableCell>{job?.title}</TableCell>
                                <TableCell>{job?.location}</TableCell>
                                <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <div onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center w-fit gap-2 cursor-pointer mt-2'>
                                        <Eye className='w-4' />
                                        <span>Applicants</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable;
