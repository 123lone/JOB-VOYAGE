// src/redux/jobSlice.js
import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null,
        searchJobByText: "",
        allAppliedJobs: [],
        searchedQuery: {
            query: "",     // Search keyword (title, company)
            jobType: "",   // Full-time / Part-time
            location: ""   // Location filter
        },
        recommendedJobs: [], // Added for personalized recommendations
        loading: false,      // Added for loading state
    },
    reducers: {
        // Existing actions
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        // New actions for recommendations
        setRecommendedJobs: (state, action) => {
            state.recommendedJobs = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const {
    setAllJobs,
    setSingleJob,
    setAllAdminJobs,
    setSearchJobByText,
    setAllAppliedJobs,
    setSearchedQuery,
    setRecommendedJobs, // Exported new action
    setLoading         // Exported new action
} = jobSlice.actions;

export default jobSlice.reducer;