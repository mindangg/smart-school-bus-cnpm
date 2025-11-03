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

module.exports = {
    getRouteAssignments,
    getRouteAssignmentById,
    getRouteAssignmentByDriver
}

