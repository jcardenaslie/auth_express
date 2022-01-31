
const httpErrors = require('http-errors')
const User = require ('../models/user.model')
const Friend = require ('../models/friend.model')

const NotificationController = require("./notifications.controller")

const create = async (req, res, next) => {
  try {
    const {username} = req.body
    const {username: requestUser, _id} = req.auth.user
    const beFriendWith = await User.findOne({username})
    const friendshipExists = await Friend.findOne({
      username: req.auth.user.username,
      friend: beFriendWith._id,
    })

    if (friendshipExists) {
      throw httpErrors.BadRequest("Already friends")
    }

    let newFriend = new Friend ({
      username: username,
      friend: beFriendWith._id,
    })
    
    newFriend = await newFriend.save()

    NotificationController.userSubscription (req.auth.user, newFriend)

    res.send ( {status: 201, message: "Friend added"})  
  } catch (error) {
    if ( error.code === 11000 ){
      throw next(httpErrors.BadRequest(`Error ${error.message}`))
    }
    next(error)
  }
}

const remove  = async (req, res, next) => {
  try {
    

    throw next(httpErrors.BadRequest(`Not implemented`))
  } catch {
    next(error)
  }
}

const getAllUserFriends  = async (req, res, next) => {
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

    const result = await Friend.paginate({username: req.auth.username}, options)
    res.send ( {status: 200, data: result})  
  } catch(error) {
    next(error)
  }
}

module.exports = {
  create,
  remove,
  getAllUserFriends
}