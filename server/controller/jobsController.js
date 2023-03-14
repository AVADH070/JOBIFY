import Job from "../model/Job.js"
import { StatusCodes } from "http-status-codes"
import { UnauthonticatedError, BadRequestError, NotFoundError } from '../errors/index.js'
import checkPermission from "../utils/checkPermission.js"
import mongoose from 'mongoose'
import moment from "moment"

const createJob = async (req, res) => {

  const { company, position } = req.body;
  if (!company || !position) {
    throw new BadRequestError('Please provide all value')
  }
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body)

  res.status(StatusCodes.CREATED).json({ job })

}

const getAllJob = async (req, res) => {

  const { status, jobType, sort, search } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  }

  if (status && status !== 'all') {
    queryObject.status = status;
  }

  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType
  }

  if (search) {
    queryObject.position = { $regex: search, $options: 'i' }
  }

  let result = Job.find(queryObject);

  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }

  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }

  if (sort === 'a-z') {
    result = result.sort('position');
  }

  if (sort === 'z-a') {
    result = result.sort('-position');
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const jobs = await result.skip(skip).limit(limit)

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);


  res.status(StatusCodes.OK).json({
    jobs,
    totalJobs,
    numOfPages
  })
}

const updateJob = async (req, res) => {
  const { id: jobId } = req.params
  const { company, position } = req.body;

  if (!company || !position) {
    throw new BadRequestError("Please Provide all value")
  }

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job found with id : ${jobId}`)
  }

  checkPermission(req.user, job.createdBy)

  const updateJob = await Job.findByIdAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true
  })

  res.status(StatusCodes.OK).json({ updateJob })
}

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params

  const job = await Job.findOne({ _id: jobId })

  if (!job) {
    throw new NotFoundError(`No job found with id : ${jobId}`)
  }
  checkPermission(req.user, job.createdBy)
  await job.remove()

  res.status(StatusCodes.OK).json({ msg: 'Success! Job Rmeoved' })

}
const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: {
            $year: '$createdAt',
          },
          month: {
            $month: '$createdAt',
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
}

export { createJob, getAllJob, deleteJob, updateJob, showStats }