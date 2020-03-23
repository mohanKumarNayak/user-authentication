const Message = require('../models/message')
const authentication = require('../middlewares/authentication')
const express = require('express')
const router = express.Router()

router.get('/',authentication,(req,res)=>{
    Message.find({ user : req.user._id})
        .then(messages => res.json(messages))
        .catch(err => res.json(err)) 
})

router.post('/',authentication,(req,res)=>{
    const body = req.body
    const message = new Message(body)
    message.user = req.user._id
    message.save()
        .then(message=>res.json(message))
        .catch(err => res.json(err))
})

router.get('/:id', authentication, (req, res) => {
    const id = req.params.id 
    Message.findOne({
        _id: id,
        user: req.user._id 
    })
    .then(message => {
        if(message) {
            res.json(message)
        } else {
            res.json({})
        }
    })
})

// put 
// Message.findOneAndUpdate({ _id: id, user: req.user._id})

router.put('/:id',authentication,(req,res)=>{
    const id = req.params.id
    const body = req.body
    Message.findOneAndUpdate({
        _id:id,
        user : req.user._id
    },body,{new:true,runValidators:true})
        .then((message)=>{
            if(message){
                res.json(message)
            }
            else{
                res.json({})
            }

        })
        .catch((err)=>{
            res.json(err)
        })
})

// delete
// Message.findOneAndDelete({ _id: id, user: req.user._id })

router.delete('/:id',authentication,(req,res)=>{
    const id = req.params.id
    Message.findOneAndDelete({
        _id:id,
        user:req.user._id
    })
        .then((message)=>{
            if(message){
                res.json(message)
            }
            else{
                res.json({})
            }
        })
        .catch((err)=>{
            res.json(err)
        })

})

module.exports = {
    messageRouter : router
}