const express = require('express')
const router = express.Router()

const { registerUser, loginUser, getUserProfile, logout } = require('../controllers/userController')

const { protectGetUser, protect } = require('../middleware/authMiddleware')

router.route('/').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').delete(protect, logout)
router.route('/:username').get(protectGetUser, getUserProfile)

module.exports = router
