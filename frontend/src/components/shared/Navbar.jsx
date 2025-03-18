import React from 'react';
import { LogOut, User2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null)); 
                toast.success(res.data.message);

                setTimeout(() => {
                    window.location.href = "/"; 
                }, 1);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    

    return (
        <div className='bg-white' style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: '60px' }} >            <div className='flex items-center justify-between mx-auto max-w-6xl h-16'>
            <div>
                <h1 className='text-2xl font-bold'>Job<span className='text-[dodgerblue]'>Voyage</span></h1>
            </div>
            <div className='flex items-center gap-12'>
                <ul className='flex font-medium items-center gap-5'>
                    {user && user.role === 'Employer' ? (
                        <>
                            <li><Link to="/admin/companies">Companies</Link></li>
                            <li><Link to="/admin/jobs">Jobs</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/jobs">Jobs</Link></li>
                            <li><a href="/browse">Browse</a></li>
                        </>
                    )}
                </ul>
                {!user ? (
                    <div className='flex items-center gap-2'>
                        <Link to="/login"><button className="border px-4 py-2 rounded">Login</button></Link>
                        <Link to="/signup"><button className="bg-[dodgerblue] hover:bg-[#5b30a6] text-white px-4 py-2 rounded">Signup</button></Link>
                    </div>
                ) : (
                    <div className='relative'>
                        <img
                            src={user?.profile?.profilePhoto}
                            alt="User Avatar"
                            className="cursor-pointer rounded-full w-10 h-10"
                            onClick={() => document.getElementById('profile-menu').classList.toggle('hidden')}
                        />
                        <div id="profile-menu" className='absolute right-0 mt-2 w-64 bg-white shadow-lg hidden'>
                            <div className='flex gap-2 p-4'>
                                <img src={user?.profile?.profilePhoto} alt="Profile" className='w-10 h-10 rounded-full' />
                                <div>
                                    <h4 className='font-medium'>{user?.fullname}</h4>
                                    <p className='text-sm text-gray-600'>{user?.profile?.bio}</p>
                                </div>
                            </div>
                            <div className='flex flex-col my-2 px-4'>
                                {user && user.role === 'Job Seeker' && (
                                    <div className='flex items-center gap-2 cursor-pointer'>
                                        <User2 />
                                        <Link to="/profile" className='text-blue-600 hover:underline'>View Profile</Link>
                                    </div>
                                )}
                                <div className='flex items-center gap-2 cursor-pointer'>
                                    <LogOut />
                                    <button onClick={logoutHandler} className='text-blue-600 hover:underline'>Logout</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </div>
    );
};

export default Navbar;
