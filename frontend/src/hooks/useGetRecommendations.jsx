// src/hooks/useGetRecommendations.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setRecommendedJobs, setLoading } from '@/redux/jobSlice';

const useGetRecommendations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user || !user.role) {
        console.log('User not authenticated, skipping recommendations fetch:', user);
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No token found, user may need to log in');
        return;
      }

      console.log('Using token for request:', token); // Log the token for debugging
      dispatch(setLoading(true));
      try {
        const url = `${USER_API_END_POINT}/get-recommended-jobs`;
        console.log('Fetching recommendations from:', url);
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Recommendations API response:', res.data);
        if (res.data && res.data.recommended_jobs) {
          dispatch(setRecommendedJobs(res.data.recommended_jobs));
          console.log('Recommendations set in Redux:', res.data.recommended_jobs);
        } else {
          console.log('No recommendations data received, setting empty array');
          dispatch(setRecommendedJobs([]));
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error.message);
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
          if (error.response.status === 401 || error.response.status === 403) {
            console.log('Invalid or unauthorized token, clearing token and redirecting');
            localStorage.removeItem('authToken'); // Clear invalid token
            setTimeout(() => navigate('/login'), 0); // Redirect after delay
          }
        }
        dispatch(setRecommendedJobs([]));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchRecommendations();
  }, [dispatch, navigate, user]);

  return null;
};

export default useGetRecommendations;