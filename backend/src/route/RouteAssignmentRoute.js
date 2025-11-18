const express = require('express')
const router = express.Router()
const routeAssignmentController = require('../controller/RouteAssignmentController')
const {requireAuth} = require("../middleware/requireAuth")
const routeController = require("../controller/RouteController");

// router.use(requireAuth)

// router.get('/', routeAssignmentController.getRouteAssignments)

router.get('/driver', routeAssignmentController.getRouteAssignmentByDriver)

// router.get('/:id', routeAssignmentController.getRouteAssignmentById)

router.get('/', routeAssignmentController.getAllSchedules)

router.get('/:id',routeAssignmentController.getRouteDetails)

router.post('/', routeAssignmentController.createRouteAssignment)

module.exports = router