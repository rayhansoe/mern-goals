const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()
const colors = require('colors')
const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorMiddleware')
const port = process.env.PORT || 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cors({ origin: true }))

app.use('/api/goals', require('./routes/goalRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

if (process.env.NODE_ENV === 'production') {
	app.get('/', (req, res) => res.redirect(301, 'http://goalsapp-one.vercel.app'))
} else {
	app.get('/', (req, res) => res.send('Please set to production'))
}

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))
