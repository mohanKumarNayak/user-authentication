const express = require('express')
const app = express()
const setUpDb = require('./config/database')
const {userRouter} = require('./app/controllers/userControllers')
const {messageRouter} = require('./app/controllers/messageControllers')
const port = 3065

app.use(express.json())

setUpDb()

app.use('/users',userRouter)
app.use('/messages',messageRouter)

app.listen(port,()=>{
    console.log('listening on port ',port)
})