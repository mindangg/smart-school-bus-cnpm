const routeAssignmentService = require('../service/RouteAssignmentService')
const axios = require('axios')

const getRouteAssignments = async (req, res) => {
    try {
        const routeAssignments = await routeAssignmentService.getRouteAssignments()
        res.status(200).json(routeAssignments)
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getRouteAssignmentById = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        const route = await routeAssignmentService.getRouteAssignmentById(Number(id))
        res.status(200).json(route)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getRouteAssignmentByDriver = async (req, res) => {
    try {
        const route = await routeAssignmentService.getRouteAssignmentByDriver(req.user_id)
        res.status(200).json(route)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//hbao
const getRouteDetails = async (req, res) => {
    try{
        const routeId = parseInt(req.params.id)
        if(isNaN(routeId)){
            return res.status(400).json({ error: 'Invalid route ID' })
        }

        const routeData = await routeAssignmentService.getRouteById(routeId)

        if(!routeData){
            return res.status(404).json({ error: 'Route not found' })
        }
        res.json(routeData)
    }
    catch (error) {
        console.error('Error fetching route details:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

const getAllSchedules = async (req, res) => {
    try {
        const schedules = await routeAssignmentService.getAllSchedules()
        res.json(schedules)
    } catch (error) {
        console.error('Error fetching schedules:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

const createRouteAssignment = async (req, res) => {
    try {
        const routeAssignmentData = req.body
        const newRouteAssignment = await routeAssignmentService.createRouteAssignment(routeAssignmentData)
        res.status(201).json(newRouteAssignment)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {
    getRouteAssignments,
    getRouteAssignmentById,
    getRouteAssignmentByDriver,
    getAllSchedules,
    getRouteDetails,
    createRouteAssignment
}

