const Joi = require("@hapi/joi")
const { signUpTypeEnum } = require("./../enums")

const authSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6),
  password2: Joi.string().min(6),
  country: Joi.string(),
  isSubscribed: Joi.boolean().default(false),
  birthYear: Joi.number(),
  signUpType: Joi.string().valid(...Object.values(signUpTypeEnum)),
  googleUID: Joi.string()
})

module.exports = { 
  authSchema 
}
