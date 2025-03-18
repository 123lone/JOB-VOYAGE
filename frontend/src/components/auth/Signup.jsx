import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar'; // Keep the Navbar
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        // Email and phone number validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/; // 10 digit phone number

        if (!emailRegex.test(input.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (!phoneRegex.test(input.phoneNumber)) {
            toast.error("Please enter a valid 10 digit phone number");
            return;
        }

        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div style={{ marginTop: '70px' }}>
            <Navbar /> 
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Sign Up</h1>

                    <div className='my-2'>
                        <label htmlFor="fullname">Full Name</label>
                        <input
                            type="text"
                            id="fullname"
                            name="fullname"
                            value={input.fullname}
                            onChange={changeEventHandler}
                            placeholder="Enter your name"
                            className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>

                    <div className='my-2'>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                            placeholder="Enter your email"
                            className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>

                    <div className='my-2'>
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={input.phoneNumber}
                            onChange={changeEventHandler}
                            placeholder="Enter your 10 digit phone number"
                            className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>

                    <div className='my-2'>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={input.password}
                            onChange={changeEventHandler}
                            placeholder="********"
                            className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>

                    <div className='my-5'>
                        <label htmlFor="role">Role:</label>
                        <select
                            id="role"
                            name="role"
                            value={input.role}
                            onChange={changeEventHandler}
                            className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500"
                        >
                            <option value="">Select Role</option>
                            <option value="Job Seeker">Job Seeker</option>
                            <option value="Employer">Employer</option>
                        </select>
                    </div>

                    <div className='flex items-center gap-2 my-2'>
                        <label htmlFor="file">Photo</label>
                        <input
                            accept="image/*"
                            type="file"
                            id="file"
                            onChange={changeFileHandler}
                            className="cursor-pointer"
                        />
                    </div>

                    {
                        loading ? (
                            <button type="button" className="w-full my-4 flex items-center justify-center bg-blue-600 text-white rounded-md h-10">
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait 
                            </button>
                        ) : (
                            <button type="submit" className="w-full my-4 bg-blue-600 text-white rounded-md h-10">
                                Signup
                            </button>
                        )
                    }
                    
                    <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
                </form>
            </div>
        </div>
    );
}

export default Signup;
