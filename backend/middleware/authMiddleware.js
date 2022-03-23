const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Device = require('../models/deviceModel')

const protect = asyncHandler(async (req, res, next) => {
	let token

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			// Get Token from header
			token = req.headers.authorization.split(' ')[1]

			// verify
			const decoded = jwt.verify(token, process.env.JWT_SECRET)

			// Get User from the Token / User yang login, bukan user yang mau dilihat.
			req.user = await User.findById(decoded.id).select('-password')

			const user = await User.findById(decoded.id)

			const userAgent = req.headers['user-agent'].toString()

			// const userDevice = await Device.findOne({ device: userAgent })
			const userDevice = await Device.findOne({ device: userAgent, user: user._id })

			JSON.stringify(userDevice.user) === JSON.stringify(user._id) && next()
		} catch (error) {
			res.status(401)
			throw new Error('Not Authorized')
		}
	}

	if (!token) {
		res.status(401)
		throw new Error('Not Authorized.')
	}
})

const protectGetUser = asyncHandler(async (req, res, next) => {
	let token

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			// Get Token from header
			token = req.headers.authorization.split(' ')[1]

			// verify
			const decoded = jwt.verify(token, process.env.JWT_SECRET)

			// Get User from the Token / User yang login, bukan user yang mau dilihat.
			req.user = await User.findById(decoded.id).select('-password')

			next()
		} catch (error) {
			next()
		}
	}

	if (!token) {
		next()
	}
})

module.exports = { protect, protectGetUser }
