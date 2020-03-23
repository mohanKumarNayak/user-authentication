const express = require('express')
const router = express.Router()
const User = require('../models/user')
const _ = require('lodash')
const authentication = require('../middlewares/authentication')

//localhost:3065/users/register
router.post('/register',(req,res)=>{
    const body = req.body
    const user = new User(body)
        user.save()
            .then((user)=>{
                res.json(_.pick(user,['_id','username','email']))
            })
            .catch((err)=>{
                res.json(err)
            })
})

//localhost:3065/users/login
router.post('/login',(req,res)=>{
    const body = req.body
    // User.findOne({email : body.email})
    //     .then((user)=>{
    //         if(!user){
    //             res.status('404').send('invalid email or password')
    //         }

    //         bcrypt.compare(body.password,user.password)
    //             .then((result)=>{
    //                 if(result){
    //                     res.json(user)
    //                 }
    //                 else{
    //                     res.status('404').send('invalid email or password')
    //                 }
    //             })
    //     })
    //     .catch((err)=>{
    //         res.json(err)
    //     })
    User.findByCredentials(body.email,body.password)
        .then((user)=>{
            return user.generateToken()
        })
            .then((token)=>{
                res.setHeader('x-auth', token).send({})
            })
            .catch((err)=>{
            res.json(err)
        })

})

//localhost:3065/users/account
router.post('/account',authentication,(req,res)=>{
    // const token = req.header('x-auth')
    //         User.findByToken(token)
    //             .then((user)=>{
    //                 res.json(user)
    //             })
    //             .catch((err)=>{
    //                 res.status('401').send(err)
    //             })

    const  {user,token} = req
    res.json(_.pick(user,['_id','username','email'])) 
        
})

router.delete('/logout',authentication,(req,res)=>{
    const {user,token} = req
    User.findByIdAndUpdate(user._id,{$pull : {tokens : {token : token}}})
        .then(()=>{
            res.json({notice: "successfully logged out"})
        })
        .catch((err)=>{
            res.json(err)
        })
})


module.exports = {
    userRouter : router
}