const { CustomAPIError , UnauthenticatedError} = require('../errors/customAPIErorrs')
const { StatusCodes } = require('http-status-codes')
const { User } = require('../models/models')
const jwt = require('jsonwebtoken')



const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg : err.message || 'something went wrong try again later',
  }

  /*if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }*/

  if (err.code && err.code === 11000){
    customError.msg = `Duplicate value entered for ${ Object.keys(err.keyValue) } field, Plese choose another value`
    customError.statusCode = 400
  }

  if (err.name === "ValidationError"){
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',')
    customError.statusCode = 400
  }

  if (err.name === "CastError"){
    customError.msg = `No item found with id: ${err.value}`
    customError.statusCode = 400
  }
   
  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg : customError.msg })
}




const notFoundMiddleware = (req , res) => {
    res.status(StatusCodes.NOT_FOUND).send('Route does not exist')
}




const authorizationMiddleware = async (req , res , next) => {

  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]

  try{
    const payload = await jwt.verify(token , process.env.JWT_SECRET)
    req.user = { userId : payload.userId , name : payload.userName}
    next()
  }catch(err){
    throw new UnauthenticatedError('Authentication invalid')
  }
}




module.exports = { errorHandlerMiddleware , notFoundMiddleware , authorizationMiddleware}