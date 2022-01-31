const express = require("express")
const asyncHandler = require('express-async-handler')
const router = express.Router()
const {
  getByUserId
} = require("../controllers/notifications.controller")


router.get("/", asyncHandler( getByUserId ) )

module.exports = router