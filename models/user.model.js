const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const mongoosePaginate = require('mongoose-paginate-v2');
const { signUpTypeEnum } = require("./../enums")

const UserSchema = mongoose.Schema({
  username: { 
    type: String, 
    lowercase: true, 
    unique:true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String
  },
  isSubsribed: {
    type: Boolean,
    default: false
  },
  country: {
    type: String,
  },
  birthYear: {
    type:Number
  },
  signUpType: {
    type: String,
    enum: Object.values(signUpTypeEnum),
    required: true
  },
  googleUID: {
    type: String
  }
}, {
  timestamps: true,
  strict: false
})

UserSchema.pre('save', async function (next) {
  try {
    if (this.password) {
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(this.password, salt)
      this.password = hashPassword
    }
    next()
  } catch (error) {
    next(error)
  }
} )

UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password )
  } catch (error) {
    throw error
  }
}

UserSchema.post('save', async function (next) {
  try {
  } catch (error) {
    next(error)
  }
} )

UserSchema.plugin(mongoosePaginate)

const User = mongoose.model("user", UserSchema)

module.exports = User