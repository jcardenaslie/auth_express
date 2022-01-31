const express = require("express")
const asyncHandler = require('express-async-handler')
const { authSchema } = require('../validationSchemas/user.schema')
const httpErrors = require('http-errors')
const { verifyAccessToken } = require('../helpers/jwt.helper')

const router = express.Router()
const {
  create,
  update,
  getAll,
  getById,
  remove
} = require("../controllers/users.controller")

router.post("/", asyncHandler( async (req, res, next) => {

  try {
    let user = await authSchema.validateAsync( req.body )
    const result = await create(user)
    res.send ( {status: 201, message: "User created", data: result})  
  } catch (error) {
    if ( error.code === 11000 ){
      throw next(httpErrors.BadRequest(`Duplicate ${ Object.keys (error.keyValue)[0] }`))
    }
    next(error)
  }
  
}))

router.put("/:id", verifyAccessToken, asyncHandler(update))

router.get("/", asyncHandler(getAll))

router.get("/:id", asyncHandler(getById))

router.delete("/:id", verifyAccessToken, asyncHandler(remove))

module.exports = router