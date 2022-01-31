const httpErrors = require('http-errors')
const User = require('../models/user.model')
const { authSchema } = require('../validationSchemas/user.schema')
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../helpers/jwt.helper')
const client = require('../helpers/init.redis')

const register = async (req, res, next)=>{
  try {
    // const {email, password} = req.body
    const { email, password }  = await authSchema.validateAsync(req.body)

    if(!email || !password) throw httpErrors.BadRequest()

    const userExists = await User.findOne({email})

    if (userExists) 
      throw httpErrors.Conflict(`${email} is already registered`)

    const user = new User({email, password})
    const savedUser = await user.save()
    const accessToken = await signAccessToken(savedUser._id)
    const refreshToken = await signRefreshToken(savedUser._id)

    res.send({accessToken, refreshToken})
    
  } catch (error) {
    if ( error.isJoi ) error.status = 422
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = await authSchema.validateAsync(req.body)
    const user = await User.findOne({email})

    if (!user) 
      throw httpErrors.NotFound("User not found")
    
    const isPasswordMatch = await user.isValidPassword(password)

    if (!isPasswordMatch)
      throw httpErrors.Unauthorized("Username/Password ont valid")

    const accessToken = await signAccessToken(user._id)
    const refreshToken = await signRefreshToken(user._id)

    res.send({accessToken, refreshToken})

  } catch (error) {
    if ( error.isJoi )
      return next(httpErrors.BadRequest("Invalid credentials"))
    next(error)
  }
}

const getToken = async (req, res, next) => {
  try {

    const {email} = req.query
    const user = await User.findOne({email})

    if (!user) 
      throw httpErrors.NotFound("User not found")

    const accessToken = await signAccessToken(user)
    const refreshToken = await signRefreshToken(user._id)

    res.send({accessToken, refreshToken})

  } catch (error) {
    if ( error.isJoi )
      return next(httpErrors.BadRequest("Invalid credentials"))
    next(error)
  }
}

const refreshToken = async (req, res, next)=>{
  try {
    const { refreshToken } = req.body
    if (!refreshToken) throw httpErrors.BadRequest()
    const userId = await verifyRefreshToken(refreshToken)

    const newAccessToken = await signAccessToken(userId)
    const newRefreshToken = await signRefreshToken(userId)

    res.send({newAccessToken, newRefreshToken})

  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) throw httpErrors.BadRequest()
    const userId = await verifyRefreshToken(refreshToken)

    client.DEL(userId, (err, val) => {
      if (err) {
        console.error(err.message);
        throw httpErrors.InternalServerError()
      }
      res.sendStatus(204)
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getToken
}
