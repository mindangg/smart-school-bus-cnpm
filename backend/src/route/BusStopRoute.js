const busStopController = require("../controller/BusStopController");
const express = require("express");
const {requireAuth} = require("../middleware/requireAuth");
const router = express.Router();

router.use(requireAuth)

router.get("/", busStopController.getAllBusStops);

module.exports = router;