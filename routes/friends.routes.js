const express = require("express")
const asyncHandler = require('express-async-handler')
const httpErrors = require('http-errors')

const router = express.Router()

const {
  create,
  remove,
  getAllUserFriends
} = require("../controllers/friend.controller")


router.post( "/", asyncHandler( create ))
router.delete( "/", asyncHandler( remove ))
router.get( "/", asyncHandler( getAllUserFriends ))


module.exports = router