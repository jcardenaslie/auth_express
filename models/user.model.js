const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

UserSchema.pre('save', async function (next) {
  try {
    // console.log("call before saving the user")
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(this.password, salt)
    this.password = hashPassword
    console.log(this.email, this.password )
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
    // console.log("call after saving the user")
  } catch (error) {
    next(error)
  }
} )

const User = mongoose.model("user", UserSchema)
module.exports = User