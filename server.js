// if(process.env.NODE_ENV !== 'production'){
//     require('dotenv').config()
// }

const express = require('express')
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')

const app = express()

const indexRoute = require('./routes/index.js')

const port = 3000
const DATABASE_URL = "mongodb+srv://chickdev1707:AhYF7sq5k57ITQj7@cluster0.xc4jk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

app.set('view engine', 'ejs')
app.set('views', __dirname+ '/views')
app.set('layout', 'layouts/layout')

app.use(expressLayout)
app.use(express.static('public'))

app.use('/', indexRoute);

mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error=> console.error(error))
db.once('open', ()=> console.log('connected to mongoose'))

app.listen(process.env.PORT || port)
