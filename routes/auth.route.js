const express = require("express")
const router = express.Router()
const {
  register,
  login,
  refreshToken,
  logout,
  getToken
} = require("../controllers/auth.controller")

router.post("/register", register)

router.post("/login", login)

router.post("/refresh-token", refreshToken)

router.delete("/logout", logout)

router.get("/token", getToken)

module.exports = router