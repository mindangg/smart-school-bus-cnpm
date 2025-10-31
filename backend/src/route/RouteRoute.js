const express = require('express');
const router = express.Router();
const routeController = require('../controller/RouteController');

router.get('/:id',routeController.getRouteDetails);
router.get('/', routeController.getAllSchedules);
module.exports = router;