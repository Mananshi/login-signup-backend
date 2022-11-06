const router = require('express').Router()
const User = require('../models/User')

router.post('/signup', User.signupUser)
router.post('/login', User.loginUser)

module.exports = router