const jwt = require("jsonwebtoken")
const httpErrors = require("http-errors")
const client = require("./init.redis")

const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {}
    const secret = process.env.JWT_ACCESS_TOKEN_SECRET
    const options = {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME,
      issuer: 'jquincl.com',
      audience: String(userId)
    }

    jwt.sign(payload, secret, options, (err, token) => {
      if (err){
        console.log(err.message)
        return reject(httpErrors.InternalServerError)
      }

      resolve(token)
      
    })
  })
}

const verifyAccessToken = (req, res, next) => {
  if (!req.headers.authorization)
    return next(httpErrors.Unauthorized)
  
  const auth = req.headers.authorization
  const bearerToken = auth.split(' ')
  const token = bearerToken[1]
  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const messasge = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
      return next(httpErrors.Unauthorized(messasge))
    }
    req.payload = payload
    next()
  })
}

const signRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {}
    const secret = process.env.JWT_REFRESH_TOKEN_SECRET
    const options = {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
      issuer: 'jquincl.com',
      audience: String(userId)
    }

    jwt.sign(payload, secret, options, (err, token) => {
      if (err){
        console.log(err.message)
        return reject(httpErrors.InternalServerError)
      }
      client.SET(
        String(userId), 
        token, 
        'EX', 
        process.env.REDIS_JWT_REFRESH_TOKEN_TIME, 
        (err, reply) => {
          if (err) {
            console.log(err.message);
            return reject(httpErrors.InternalServerError())
          }
          resolve(token)
      })
      resolve(token)
    })
  })
}

const verifyRefreshToken = (refreshToken) => {
  return new Promise ((resolve, reject) => {
    jwt.verify(
      refreshToken, 
      process.env.JWT_REFRESH_TOKEN_SECRET, 
      (err, payload) => {
        
        if (err) return reject(httpErrors.Unauthorized())
        
        const userId = payload.aud
        
        console.log(userId);
        
        client.GET(userId, (err, result) => {
          if( err ){
            console.log(err.message);
            return reject(httpErrors.InternalServerError())
          }

          if( refreshToken === result ) return resolve(userId)
          reject(httpErrors.Unauthorized())
          
        })
    })
  })

}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken
}