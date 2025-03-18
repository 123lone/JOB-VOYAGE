import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar'; 
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            console.log('Login response:', res.data); // Debug log for full response
            if (res.data.success) {
                // Verify the token structure
                if (!res.data.token) {
                    console.error('No token in response:', res.data);
                    toast.error('Login successful but token is missing');
                    return;
                }
                dispatch(setUser(res.data.user));
                localStorage.setItem('authToken', res.data.token); // Store the token in localStorage
                console.log('Token stored in localStorage:', res.data.token); // Confirm token storage
                navigate("/");
                toast.success(res.data.message);
            } else {
                console.log('Login success but no success flag:', res.data);
                toast.error('Login failed unexpectedly');
            }
        } catch (error) {
            console.log('Login error:', error.response ? error.response.data : error.message);
            toast.error(error.response?.data?.message || 'Login failed');
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
        <div style={{ marginTop: '100px' }}>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Login</h1>
                    
                    <div className='my-2'>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="Enter your email"
                            className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>

                    <div className='my-2'>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={input.password}
                            name="password"
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

                    {
                        loading ? (
                            <button type="button" className="w-full my-4 flex items-center justify-center bg-blue-600 text-white rounded-md h-10">
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait 
                            </button>
                        ) : (
                            <button type="submit" className="w-full my-4 bg-blue-600 text-white rounded-md h-10">
                                Login
                            </button>
                        )
                    }
                    
                    <span className='text-sm'>Don't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
                </form>
            </div>
        </div>
    );
}

export default Login;