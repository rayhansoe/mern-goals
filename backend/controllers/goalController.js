const asyncHandler = require('express-async-handler')
const Goal = require('../models/goalModel')

// @desc Get Goals
// @route GET /api/goals
// @access PRIVATE
const getGoals = asyncHandler(async (req, res) => {
	const goal = await Goal.find()
	res.status(200).json(goal)
})

// @desc Set Goal
// @route POST /api/goals
// @access PRIVATE
const setGoal = asyncHandler(async (req, res) => {
	if (!req.body.text) {
		res.status(400)
		throw new Error('Please add a text field')
	}

	const goal = await Goal.create({
		text: req.body.text,
	})

	res.status(200).json(goal)
})

// @desc Update Goal
// @route PUT /api/goals/:id
// @access PRIVATE
const updateGoal = asyncHandler(async (req, res) => {
	const goal = await Goal.findById(req.params.id)

	if (!goal) {
		res.status(400)

		throw new Error('Goal Not Found!')
	}

	const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	})

	res.status(200).json(updatedGoal)
})

// @desc Delete Goal
// @route DELETE /api/goals/:id
// @access PRIVATE
const deleteGoal = asyncHandler(async (req, res) => {
	const goal = await Goal.findById(req.params.id)

	if (!goal) {
		res.status(400)

		throw new Error('Goal Not Found!')
	}

	await goal.remove()

	res.status(200).json({ message: `Delete Goal ${req.params.id}` })
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
}
