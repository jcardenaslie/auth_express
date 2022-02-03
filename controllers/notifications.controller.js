const  Notification  = require('../models/notification.model')

const  Joi  = require("@hapi/joi")
Joi.objectId = require('joi-objectid')(Joi)


const schemas = {
  usersNotification:  Joi.object({
    userIds: Joi.array().items(Joi.objectId()),
    title: Joi.string().required(),
    body: Joi.string().required(),
  }),
  user: Joi.object({
    _id: Joi.objectId().required(),
    username: Joi.string().required()
  }).unknown(true)
}

export const getByUserId = async (req, res, next) => {
  try {
    const {_id} = req.auth.user
    const { page = 1, limit = 10 } = req.query

    const options = {
      page : page || 1,
      limit : limit || 10,
      lean : true,
      pagination : (limit) ? true : false,
      sort : {createdAt: 'desc'},
    }

    const result = await Notification.paginate({ userIds: {$in: [_id] } }, options)
    res.send ( {status: 200, data: result})  
  } catch (error) {
    next(error)
  }
}

const userSubscription = async (follower, followed) => {
  follower = await schemas.user.validateAsync(follower)
  followed = await schemas.user.validateAsync(followed)

  createForUsers ({
    userIds: [followed._id],
    title: `New Follower` ,
    body: `${follower.username} start following you`
  })

  createForUsers ({
    userIds: [follower._id],
    title: `New subscription` ,
    body: `Now following ${followed.username} `
  })
}

const createForUsers = async (notification) => {
  notification = await schemas.usersNotification.validateAsync(notification)
  notification = new Notification(notification)
  notification.save()
}


module.exports = {
  getByUserId,
  userSubscription
}

