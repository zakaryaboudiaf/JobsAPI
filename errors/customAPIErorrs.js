const { StatusCodes } = require('http-status-codes')

class CustomAPIError extends Error {
    constructor (message){
        super(message)
    }
}

class UnauthenticatedError extends CustomAPIError {
    constructor ( message ){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED 
    }
}

class BadRequestError extends CustomAPIError {
    constructor ( message ){
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST 
    }
}

class NotFoundError extends CustomAPIError {
    constructor ( message ){
        super(message)
        this.statusCode = StatusCodes.NOT_FOUND 
    }
}




module.exports = { CustomAPIError , UnauthenticatedError , BadRequestError , NotFoundError}