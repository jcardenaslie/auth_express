const { boolean } = require("@hapi/joi");
const {Schema, model} = require("mongoose")
const mongoosePaginate = require('mongoose-paginate-v2');
const { signUpTypeEnum } = require("../enums")
const User = require ('./user.model')

const NotificationSchema = Schema({
  userIds: [{ 
    type : Schema.Types.ObjectId, 
    ref: User,
    index: true 
  }],
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  strict: false
})

NotificationSchema.plugin(mongoosePaginate)

const Notification = model("notification", NotificationSchema)

module.exports = Notification