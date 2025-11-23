const { Router } = require('express');
const router = Router(); // Initialize router
const routeStopController = require("../controller/RouteStopController");
const { requireAuth } = require('../middleware/requireAuth');
const studentController = require("../controller/StudentController");

router.use(requireAuth)
// This route is used by the frontend to get stops for a selected route
// router.get(
//     '/:routeId/stops',
//     requireAuth, 
//     routeStopController.getStopsForRoute
// );


// router.put(
//     '/:studentId/stop',
//     requireAuth,
//     studentController.updateStudentStops
// );

module.exports = router;