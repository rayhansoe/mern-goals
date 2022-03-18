const asyncHandler = require('express-async-handler')
const Goal = require('../models/goalModel')
const User = require('../models/userModel')

// @desc Get Goals
// @route GET /api/goals
// @access PRIVATE
const getGoals = asyncHandler(async (req, res) => {
	const goal = await Goal.find({ user: req.user.id })
	res.status(200).json(goal)
})

// @desc Get Goals by ID
// @route GET /api/goals/:id
// @access PRIVATE
const getGoalsById = asyncHandler(async (req, res) => {
	const goal = await Goal.findById(req.params.id)

	// Check User
	if (!req.user) {
		res.status(401)
		throw new Error('User not authorized!')
	}

	// Make sure  the logged in user matches the goal user
	if (goal.user.toString() !== req.user.id) {
		res.status(401)
		throw new Error('User not authorized!')
	}

	res.status(200).json(goal)
})

// @desc Set Goal || Create Goal
// @route POST /api/goals
// @access PRIVATE
const setGoal = asyncHandler(async (req, res) => {
	if (!req.body.text) {
		res.status(400)
		throw new Error('Please add a text field')
	}

	const goal = await Goal.create({
		text: req.body.text,
		user: req.user.id,
	})

	res.status(200).json({ goal, message: 'New Goal Created!' })
})

// @desc Update Goal by ID
// @route PUT /api/goals/:id
// @access PRIVATE
const updateGoal = asyncHandler(async (req, res) => {
	const goal = await Goal.findById(req.params.id)

	if (!goal) {
		res.status(400)

		throw new Error('Goal Not Found!')
	}

	// Check User
	if (!req.user) {
		res.status(401)
		throw new Error('User not authorized!')
	}

	// Make sure  the logged in user matches the goal user
	if (goal.user.toString() !== req.user.id) {
		res.status(401)
		throw new Error('User not authorized!')
	}

	const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	})

	res.status(200).json({
		updatedGoal,
		message: 'The Goal is Updated',
	})
})

// @desc Delete Goal by ID
// @route DELETE /api/goals/:id
// @access PRIVATE
const deleteGoal = asyncHandler(async (req, res) => {
	const goal = await Goal.findById(req.params.id)

	if (!goal) {
		res.status(400)

		throw new Error('Goal Not Found!')
	}

	// Check User
	if (!req.user) {
		res.status(401)
		throw new Error('User not authorized!')
	}

	// Make sure  the logged in user matches the goal user
	if (goal.user.toString() !== req.user.id) {
		res.status(401)
		throw new Error('User not authorized!')
	}

	await goal.remove()

	res.status(200).json({
		message: `Delete Goal ${goal.text}`,
		id: req.params.id,
	})
})

// *
// **
// ****
// export all functions
module.exports = {
	getGoals,
	setGoal,
	updateGoal,
	deleteGoal,
	getGoalsById,
}
