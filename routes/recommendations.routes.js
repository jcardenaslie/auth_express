const express = require("express")
const asyncHandler = require('express-async-handler')
const httpErrors = require('http-errors')

const router = express.Router()

const {
  recommendFriend,
  getAllByUserId
} = require("../controllers/recommendation.controller")


router.post( "/", asyncHandler( recommendFriend ))
router.get( "/", asyncHandler( getAllByUserId ))


module.exports = router