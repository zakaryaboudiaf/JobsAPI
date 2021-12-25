require('dotenv').config()
require('express-async-errors')

// Extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const express = require('express')
const app = express()

const { errorHandlerMiddleware , notFoundMiddleware , authorizationMiddleware } = require('./middlewares/middlewares')

const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const connectDB = require('./db/connect')

app.set('trust proxy', 1)
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(rateLimiter(
    {
        windowMs : 15 * 60 * 1000,  //15 minutes
        max : 100  // limit each IP to 100 requests per windowMs
    }
))



app.use('/api/v1/auth' , authRouter)
app.use('/api/v1/jobs' , authorizationMiddleware ,jobsRouter)

app.get('/' , (req,res) =>{
    res.send("jobs API")
})


app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port , console.log(`The server is listenning on port ${port} .......`))
    }catch(err){
        console.log(err)
    }
}

start()
