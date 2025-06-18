import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getJobSuggestions } from '../controllers/jobController.js';
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/jobController.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get( getJobById);
router.route("/suggestions").get(getJobSuggestions);
export default router;

