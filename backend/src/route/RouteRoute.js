const express = require('express')
const router = express.Router()
const routeController = require('../controller/RouteController')

router.get('/', routeController.getRoutes)

router.get('/direction', routeController.getRouteDirection)

router.get('/direction_full', routeController.getRouteDirectionFull)

router.get('/:id', routeController.getRouteById)
// router.get('/', routeController.getAllSchedules)

// router.get('/:id',routeController.getRouteDetails)

module.exports = router