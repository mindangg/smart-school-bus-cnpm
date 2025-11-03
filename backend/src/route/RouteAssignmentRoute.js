const express = require('express')
const router = express.Router()
const routeAssignmentController = require('../controller/RouteAssignmentController')
const {requireAuth} = require("../middleware/requireAuth")

router.use(requireAuth)

router.get('/', routeAssignmentController.getRouteAssignments)

router.get('/driver', routeAssignmentController.getRouteAssignmentByDriver)

router.get('/:id', routeAssignmentController.getRouteAssignmentById)

module.exports = router