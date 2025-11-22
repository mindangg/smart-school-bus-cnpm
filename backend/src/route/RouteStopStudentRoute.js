const express = require('express')
const router = express.Router()
const routeStopStudentController = require('../controller/RouteStopStudentController')

const { requireAuth } = require('../middleware/requireAuth');

router.get('/:id', routeStopStudentController.getStudentsAtRouteStop)

module.exports = router