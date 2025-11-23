const express = require('express')
const router = express.Router()
const routeController = require('../controller/RouteController')

const routeStopController = require('../controller/RouteStopController');
const { requireAuth } = require('../middleware/requireAuth');

router.use(requireAuth)

router.get('/', routeController.getRoutes)

router.get('/direction', routeController.getRouteDirection)

router.get('/direction_full', routeController.getRouteDirectionFull)

router.get('/:id', routeController.getRouteById)

router.get(
    '/:routeId/stops',
    routeStopController.getStopsForRoute
);

router.post('/', routeController.createRoute);

router.delete('/:id', routeController.deleteRoute);

module.exports = router