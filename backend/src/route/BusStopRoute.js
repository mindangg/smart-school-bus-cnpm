const busStopController = require("../controller/BusStopController");
const express = require("express");
const router = express.Router();

router.get("/", busStopController.getAllBusStops);

module.exports = router;