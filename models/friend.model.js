const {Schema, model} = require("mongoose")
const mongoosePaginate = require('mongoose-paginate-v2');
const { signUpTypeEnum } = require("../enums")
const User = require ('./user.model')

const FriendSchema = Schema({
  username: { 
    type: String, 
    lowercase: true,
    required: true 
  },
  friend: {
    type: Schema.Types.ObjectId,
    ref: User,
    autopopulate: true
 }
}, {
  timestamps: true,
  strict: false
})

FriendSchema.plugin(mongoosePaginate)
FriendSchema.plugin(require('mongoose-autopopulate'));

const Friend = model("friend", FriendSchema)

module.exports = Friend