
const { BadRequestError , NotFoundError } = require('../errors/customAPIErorrs')
const { StatusCodes } = require('http-status-codes')
const { Job } = require('../models/models')





const getAllJobs = async (req , res) => {
    const jobs = await Job.find({createdBy : req.user.userId}).sort('createdAt')
    if (!jobs){
        return res.status(StatusCodes.OK).json({ nbOfHits : '0'})
    }
    res.status(StatusCodes.OK).json({ nbOfHits : jobs.length , jobs : jobs})
}

const getJob = async (req , res) => {
    const { id } = req.params
    const { userId } = req.user
    const job = await Job.findOne({_id : id , createdBy : userId })
    if (!job){
        throw new NotFoundError(`there is no such job with id: ${id}` )
    }
    res.status(StatusCodes.OK).json({ nbOfHits : job.length , job : job})
}

const createJob = async (req , res) => {
    req.body.createdBy = req.user.userId

    const job = await Job.create(req.body)
  
    res.status(StatusCodes.CREATED).json( job )
}

const deleteJob = async (req , res) => {
    const { id } = req.params
    const { userId } = req.user

    const job = await Job.findOneAndDelete({ _id : id , createdBy : userId})
    if (!job){
        throw new NotFoundError(`there is no such job with id: ${id}` )
    }

    res.status(StatusCodes.OK).json(job)
}

const updateJob = async (req , res) => {
    const { id } = req.params
    const { userId } = req.user
    const { company , position } = req.body
    if (!company || !position){
        throw new BadRequestError('Please indecate the new company and position')
    }
    const job = await Job.findOneAndUpdate({ _id : id , createdBy : userId} , req.body , {new : true , runValidators: true})
    if (!job){
        throw new NotFoundError(`there is no such job with id: ${id}` )
    }
    res.status(StatusCodes.OK).json(job)
}


module.exports = { getAllJobs , getJob , createJob , updateJob, deleteJob }