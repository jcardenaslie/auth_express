const express = require("express")
const asyncHandler = require('express-async-handler')
const router = express.Router()
const {
  getByUserId,
  readNotification,
  countUnReadNotifications,
  unreadNotification
} = require("../controllers/notifications.controller")


router.get("/", asyncHandler( getByUserId ) )

router.get("/unread/count", asyncHandler( countUnReadNotifications ) )

router.patch("/:id/read", asyncHandler( readNotification  ))
router.delete("/:id/read", asyncHandler( unreadNotification  ))

module.exports = router