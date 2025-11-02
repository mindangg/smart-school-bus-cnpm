const express = require('express')
const router = express.Router()
const routeController = require('../controller/RouteController')

router.get('/', routeController.getAllSchedules)

router.get('/direction', routeController.getRouteDirection)

router.get('/:id',routeController.getRouteDetails)

module.exports = router