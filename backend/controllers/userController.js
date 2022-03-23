const User = require('../models/userModel')
const Device = require('../models/deviceModel')
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

	// by email & username
	if (userExistByEmail && userExistByUsername) {
		res.status(400)
		throw new Error('Username & Email already taken.')
	}

	// by username
	if (userExistByUsername) {
		res.status(400)
		throw new Error('Username already taken.')
	}

	// by email
	if (userExistByEmail) {
		res.status(400)
		throw new Error('Email already taken.')
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
		const userDevices = await Device.find({ user: user._id })

		if (userDevices > 5) {
			res.status(401)
			throw new Error('Unauthorized: Invalid Credentials.')
		}

		const device =
			(await Device.findOne({ device: userAgent, user: user._id })) ||
			(await Device.create({
				device: userAgent,
				user: user._id,
			}))

		if (device) {
			res.status(201).json({
				token: generateToken(user._id),
				userProfile: {
					_id: user._id,
					username,
					name,
				},
			})
		}
	} else {
		res.status(400)
		throw new Error('Invalid user data.')
	}
})

// @desc Login User
// @route POST /api/users/login
// @access PUBLIC
const loginUser = asyncHandler(async (req, res) => {
	const { text, password } = req.body

	// check user
	const user = (await User.findOne({ email: text })) || (await User.findOne({ username: text }))

	if (user && (await bcrypt.compare(password, user.password))) {
		const { _id, username, name } = user
		const userDevices = await Device.find({ user: _id })

		if (userDevices && userDevices > 5) {
			res.status(401)
			throw new Error('Unauthorized: Invalid Credentials.')
		}

		const userAgent = req.headers['user-agent'].toString()
		const device =
			(await Device.findOne({ device: userAgent, user: user._id })) ||
			(await Device.create({
				device: userAgent,
				user: user._id,
			}))

		if (device) {
			res.status(200)
			res.json({
				token: generateToken(user._id),
				userProfile: {
					_id,
					username,
					name,
				},
			})
		}
	} else {
		res.status(401)
		throw new Error('Unauthorized: Invalid Credentials.')
	}
})

// @desc Get User Profile
// @route GET /api/users/:username
// @access PUBLIC & PRIVATE
const getUserProfile = asyncHandler(async (req, res) => {
	const usernameParam = req.params.username
	const userExist = await User.findOne({ username: usernameParam })

	const userAgent = req.headers['user-agent'].toString()

	const userDevice = await Device.findOne({ device: userAgent })

	// if user exist
	if (userExist) {
		const { _id, username, name, email } = userExist

		if (
			req.user &&
			userExist.id === req.user.id &&
			JSON.stringify(userDevice.user) === JSON.stringify(req.user._id)
		) {
			res.status(200).json({
				id: _id,
				username,
				name,
				email,
			})
		} else {
			res.status(200).json({
				id: _id,
				username,
				name,
			})
		}
	} else {
		res.status(404)
		throw new Error('the username is invalid.')
	}
})

// @desc logout user
// @route POST /api/users/logout
// @access PRIVATE
const logout = asyncHandler(async (req, res) => {
	const userAgent = req.headers['user-agent'].toString()

	const device = await Device.findOne({ device: userAgent })

	if (!device) {
		res.status(400)
		throw new Error('Device not match.')
	}

	await device.remove()

	res.status(200).json({
		message: `Success Logout.`,
	})
})

// @desc Generate JWT
const generateToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {})
}

module.exports = {
	registerUser,
	loginUser,
	getUserProfile,
	logout,
}
