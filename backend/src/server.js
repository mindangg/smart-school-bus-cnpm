require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const UserRoute = require('./route/UserRoute')
const StudentRoute = require('./route/StudentRoute')
const RouteRoute = require('./route/RouteRoute')
const StudentEventRoute = require('./route/StudentEventRoute')
const RouteAssignmentRoute = require('./route/RouteAssignmentRoute')
const BusRoute = require('./route/BusRoute')

const app = express()

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

app.use(express.json())

// routes

app.use('/api/users', UserRoute)
app.use('/api/students', StudentRoute)
app.use('/api/routes', RouteRoute)
app.use('/api/student_events', StudentEventRoute)
app.use('/api/route_assignment', RouteAssignmentRoute)
app.use('/api/buses', BusRoute)

app.get('/', (req, res) => {
    res.send('Welcome to my app')
})

app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
})
