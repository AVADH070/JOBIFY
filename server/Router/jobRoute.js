import express from 'express'
const router = express.Router();
import {
    createJob,
    getAllJob,
    deleteJob,
    updateJob,
    showStats
} from "../controller/jobsController.js";

router.route('/').post(createJob).get(getAllJob)
router.route('/stats').get(showStats)
router.route('/:id').delete(deleteJob).patch(updateJob)

export default router;