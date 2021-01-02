if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const {authUser, authRole} = require('./auth')
const {ROLE, users} = require('./authData')


//App
app.set('view engine', 'pug')
app.set('views',__dirname+'/views')
app.use(express.static('public'))
app.use(express.static('files'))
app.use(express.json())
app.use(setUser)


//MongoDB
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL,{useUnifiedTopology: true, useNewUrlParser: true})
const db=mongoose.connection
db.on('error',error=>console.error(error))
db.once('open',()=>console.log('Connected to Mongoose'))


//Routes
const indexRouter = require('./routes/index')
const adminRouter = require('./routes/admin')
const cartRouter  = require('./routes/cart')
app.use('/',indexRouter)
app.use('/admin',authUser,authRole(ROLE.ADMIN),adminRouter)
app.use('/cart',cartRouter)


//Set user (Application-level middleware)
function setUser(req, res, next) {
    const userId = req.body.userID
    if (userId) {
      req.user = users.find(user => user.id === userId)
    }
    next()
}


//Port listening
app.listen(process.env.PORT||3000)
