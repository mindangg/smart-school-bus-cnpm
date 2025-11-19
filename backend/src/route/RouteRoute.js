const express = require('express')
const router = express.Router()
const routeController = require('../controller/RouteController')

const routeStopController = require('../controller/RouteStopController');
const { requireAuth } = require('../middleware/requireAuth');

router.get('/', routeController.getRoutes)

router.get('/direction', routeController.getRouteDirection)

router.get('/direction_full', routeController.getRouteDirectionFull)

router.get('/:id', routeController.getRouteById)
// router.get('/', routeController.getAllSchedules)

// router.get('/:id',routeController.getRouteDetails)

router.get(
    '/:routeId/stops',
    routeStopController.getStopsForRoute
);

module.exports = router