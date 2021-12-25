const moongose = require('mongoose')

const connectDB = (url) => { 
    return moongose.connect(url , {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })

}

module.exports = connectDB