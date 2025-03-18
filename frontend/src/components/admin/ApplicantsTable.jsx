import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

    const statusHandler = async (status, id, email) => {
        try {
            axios.defaults.withCredentials = true;

            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                const job = res.data.job;
            

                await axios.post(`http://localhost:5000/api/email/send-email`, {
                    to: email,
                    subject: `Your application has been ${status}`,
                    message: `Dear Applicant,\n\nYour application status for the role of ${job.title} in ${job.location} has been ${status}.\n\nThank you for your application!`,
                });
                toast.success('Status updated and email sent successfully');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead style={{ backgroundColor: '#bbdefb', color: 'black', padding: '10px', textAlign: 'left' }}>FullName</TableHead>
                        <TableHead style={{ backgroundColor: '#bbdefb', color: 'black', padding: '10px', textAlign: 'left' }}>Email</TableHead>
                        <TableHead style={{ backgroundColor: '#bbdefb', color: 'black', padding: '10px', textAlign: 'left' }}>Contact</TableHead>
                        <TableHead style={{ backgroundColor: '#bbdefb', color: 'black', padding: '10px', textAlign: 'left' }}>Resume</TableHead>
                        <TableHead style={{ backgroundColor: '#bbdefb', color: 'black', padding: '10px', textAlign: 'left' }}>Date</TableHead>
                        <TableHead style={{ backgroundColor: '#bbdefb', color: 'black', padding: '10px', textAlign: 'left' }} className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell>
                                    {
                                        item.applicant?.profile?.resume ? <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">{item?.applicant?.profile?.resumeOriginalName}</a> : <span>NA</span>
                                    }
                                </TableCell>
                                <TableCell>{item?.applicant?.createdAt ? item.applicant.createdAt.split("T")[0] : 'N/A'}</TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {
                                                shortlistingStatus.map((status, index) => (
                                                    <div
                                                        onClick={() => statusHandler(status, item?._id, item?.applicant?.email)}
                                                        key={index}
                                                        className='flex w-fit items-center my-2 cursor-pointer'
                                                    >
                                                        <span>{status}</span>
                                                    </div>
                                                ))
                                            }
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    );
}

export default ApplicantsTable;
