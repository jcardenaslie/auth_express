const express = require("express")
const asyncHandler = require('express-async-handler')
const router = express.Router()
const {
  getByUserId
} = require("../controllers/notifications.controller")


router.get("/", asyncHandler( getByUserId ) )

// router.patch("/:id/read", asyncHandler(  ))

module.exports = router