
const httpErrors = require('http-errors')
const User = require ('../models/user.model')
const Recommendation = require ('../models/recommendation.model')

const NotificationController = require("./notifications.controller")

const recommendFriend = async (req, res, next) => {
  try {

    console.log(req.body)
    console.log(req.auth)

    return;
    
    const {idUser} = req.body
    const {    
      titleMovie,
      idMovie,
      idFriend
    } = req.auth.user


    if (friendshipExists) {
      throw httpErrors.BadRequest("Already friends")
    }
    
    newFriend = await Recommendation.save()

    NotificationController.userSubscription (req.auth.user, newFriend)

    res.send ( {status: 201, message: "Friend added"})  
  } catch (error) {
    if ( error.code === 11000 ){
      throw next(httpErrors.BadRequest(`Error ${error.message}`))
    }
    next(error)
  }
}

const getAllByUserId  = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const options = {
      page : page || 1,
      limit : limit || 10,
      lean : true,
      pagination : (limit) ? true : false,
      sort : {createdAt: 'desc'},
      populate: 'friend',
    }

    const result = await Recommendation.paginate({user: req.auth._id}, options)
    res.send ( {status: 200, data: result})  
  } catch(error) {
    next(error)
  }
}

module.exports = {
  recommendFriend,
  getAllByUserId
}