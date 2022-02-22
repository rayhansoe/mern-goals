const asyncHandler = require('express-async-handler')
const User = require('../model/userModel')

// @desc Register User
// @route POST /api/users
// @access PUBLIC
const registerUser = asyncHandler(async (req, res) => {
	res.status(201).json({ message: 'User Created.' })
})

// @desc Login User
// @route POST /api/users/login
// @access PUBLIC
const loginUser = asyncHandler(async (req, res) => {
	res.status(201).json({ message: 'User login.' })
})

// @desc Get User Profile
// @route POST /api/users
// @access PUBLIC & PRIVATE
const getUserProfile = asyncHandler(async (req, res) => {
	res.status(201).json({ message: 'User Profile.' })
})

module.exports = {
	registerUser,
	loginUser,
	getUserProfile,
}
