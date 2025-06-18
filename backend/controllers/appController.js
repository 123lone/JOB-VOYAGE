import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company',
                options: { sort: { createdAt: -1 } },
            }
        });
        if (!application) {
            return res.status(404).json({
                message: "No Applications",
                success: false
            })
        };
        return res.status(200).json({
            application,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
        });
        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            })
        };
        return res.status(200).json({
            job,
            succees: true
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateStatus = async (req, res) => {
    const { id } = req.params; // This should be the application ID
    const { status } = req.body; // Status should be sent in the request body

    try {
        // Update the application's status in the database
        const updatedApplication = await Application.findByIdAndUpdate(id, { status }, { new: true });

        // Check if the application was found and updated
        if (!updatedApplication) {
            return res.status(404).json({
                success: false,
                message: 'Application not found.',
            });
        }

        // Fetch the job details associated with the application
        const job = await Job.findById(updatedApplication.job); // Assuming each application has a job reference

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found.',
            });
        }

        // Return a success response including the updated application and job details
        res.status(200).json({
            success: true,
            message: 'Status updated successfully',
            job, // Include the job details in the response
            application: updatedApplication, // Optionally include updated application details
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ success: false, message: 'Error updating status', error });
    }
};