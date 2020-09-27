const express = require('express')
const mongoose = require('mongoose')
const app = express()
const { MongoURI } = require('./config/keys')
const PORT = process.env.PORT || 5000

// connecting to mongodb
mongoose.connect(MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on("connected", () => {
    console.log("Connected to Mongodb Atlas!")
})

mongoose.connection.on("error", (e) => {
    console.log(e)
})

// registering all the models to the app
require('./models/user')
require('./models/post')

// app specific
app.use(express.json())

// registering all the routes
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if (process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
