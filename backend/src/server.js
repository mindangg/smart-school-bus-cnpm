// backend/src/server.js (Updated)
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const http = require('http')
const BusLocationServer = require('./websocket/BusLocationServer')

const UserRoute = require('./route/UserRoute')
const StudentRoute = require('./route/StudentRoute')
const RouteRoute = require('./route/RouteRoute')
const StudentEventRoute = require('./route/StudentEventRoute')
const RouteAssignmentRoute = require('./route/RouteAssignmentRoute')
const BusRoute = require('./route/BusRoute')
const BusStopRoute = require('./route/BusStopRoute')
const RouteStopRoute = require('./route/RouteStopRoute')
const RouteStopStudentRoute = require('./route/RouteStopStudentRoute')
const NotificationRoute = require('./route/NotificationRoute')
const AdminRoute = require('./route/AdminRoute')

const app = express()
const server = http.createServer(app)

const busLocationServer = new BusLocationServer(server)

app.set('busLocationServer', busLocationServer)

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

app.use('/api/users', UserRoute)
app.use('/api/students', StudentRoute)
app.use('/api/routes', RouteRoute)
app.use('/api/student_events', StudentEventRoute)
app.use('/api/route_assignment', RouteAssignmentRoute)
app.use('/api/buses', BusRoute)
app.use('/api/route_stops', RouteStopRoute)
app.use('/api/bus_stops', BusStopRoute)
app.use('/api/route_stop_student', RouteStopStudentRoute)
app.use('/api/notifications', NotificationRoute)
app.use('/api/admin', AdminRoute)

app.get('/', (req, res) => {
    res.send('Welcome to my app')
})

app.get('/api/bus-location/:assignment_id', (req, res) => {
    const { assignment_id } = req.params
    const location = busLocationServer.getCurrentLocation(parseInt(assignment_id))

    if (location) {
        res.json(location)
    } else {
        res.status(404).json({ message: 'Location not found' })
    }
})

server.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log(`WebSocket server running at ws://localhost:${process.env.PORT}/ws/bus-location`)
})