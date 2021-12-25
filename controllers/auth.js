const { User } = require('../models/models')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError , UnauthenticatedError } = require('../errors/customAPIErorrs')

const bcrypt = require('bcryptjs')



const register = async (req , res) => {

    const { name , email , password } = req.body
    const user = await User.create(req.body)
    res.status(StatusCodes.CREATED).json({ user : user.getName() , token : user.createJWT() })
}

const login = async (req , res) => {

    const { email , password} = req.body
    if ( !email || !password){
        throw new BadRequestError('Please enter an email and password')
    }
    const user = await User.findOne({ email : email})
    if (!user){
        throw new UnauthenticatedError('Invalid email')
    }
    const authenticated = await user.checkPassword(password)
    if (!authenticated){
        throw new UnauthenticatedError('wrong password')
    }

    const token = await user.createJWT()

    res.status(StatusCodes.OK).json( {name : user.name , token : token} )
}


module.exports = {register , login}