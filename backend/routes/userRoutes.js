const express = require('express')
const router = express.Router()

const { registerUser, loginUser, getUserProfile } = require('../controllers/userController')

const { protectGetUser } = require('../middleware/authMiddleware')

router.route('/').post(registerUser)
router.route('/login').post(loginUser)
router.route('/:username').get( protectGetUser, getUserProfile)

module.exports = router
