const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const UserSchema = new mongoose.Schema( {

    name : {
        type : String,
        required : [true , 'Please provide a name'],
        minLenght : 3,
        maxLength : 50
    },
    email : {
        type : String,
        required : [true , 'Please provide an email'],
        match : [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
            'please provide a valid email' ],
        unique : true 
    },
    password : {
        type : String,
        required : [true , 'Please enter your password'],

    }
})

/********************************************************************************************************************** */
const JobSchema = new mongoose.Schema({

    company : {
        type : String,
        required : [true , 'Plese provide a campany'],
        maxLength : 50,
    },
    position : {
        type : String,
        required : [true , 'Plese provide a position'],
        maxLength : 100,
    },
    status : {
        type : String,
        enum : ['interview' , 'declined' , 'panding'],
        default : 'panding'
    },
    createdBy : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required : [true , 'Please provide a user']
    },   
} , {timestamps : true})

/********************************************************************************************************************** */

UserSchema.pre('save' , async function(  ) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password , salt)

})

UserSchema.methods.getName = function () {
    return this.name
}

UserSchema.methods.createJWT = function () {
    return jwt.sign( {userId : this._id , userName : this.name } , process.env.JWT_SECRET , { expiresIn : '30d'})
}

UserSchema.methods.checkPassword = async function (hashedPassword) {
    const matched = await bcrypt.compare(hashedPassword , this.password)
    return matched
}


const jobModel = mongoose.model('Job' , JobSchema)
const userModel = mongoose.model('User' , UserSchema)

module.exports = { User : userModel , Job : jobModel }