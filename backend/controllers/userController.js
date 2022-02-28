const User = require('../model/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// @desc Register User
// @route POST /api/users
// @access PUBLIC
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password, username } = req.body

	// check the fields
	if (!name || !email || !password || !username) {
		res.status(400)

		throw new Error('Please add all fields.')
	}

	// check if user exists
	const userExistByEmail = await User.findOne({ email })
	const userExistByUsername = await User.findOne({ username })

	// by email
	if (userExistByEmail) {
		res.status(400)
		throw new Error('Email already taken.')
	}

	// by username
	if (userExistByUsername) {
		res.status(400)
		throw new Error('Username already taken.')
	}

	// Hash Password
	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(password, salt)

	// Create User
	const user = await User.create({
		name,
		email,
		username,
		password: hashedPassword,
	})

	if (user) {
		res.status(201).json({
			_id: user.id,
			username: user.username,
			name: user.name,
			email: user.email,
		})
	} else {
		res.status(400)
		throw new Error('Invalid user data.')
	}
})

// @desc Login User
// @route POST /api/users/login
// @access PUBLIC
const loginUser = asyncHandler(async (req, res) => {
	res.status(201).json({ message: 'User login.' })
})

// @desc Get User Profile
// @route GET /api/users
// @access PUBLIC & PRIVATE
const getUserProfile = asyncHandler(async (req, res) => {
	const username = req.params.username
	const userExist = await User.findOne({ username })

	// if user exist
	if (userExist) {
		res.status(200).json({
			username: userExist.username,
			name: userExist.name,
		})
	} else {
		res.status(404)
		throw new Error('the username is invalid.')
	}
})

module.exports = {
	registerUser,
	loginUser,
	getUserProfile,
}
