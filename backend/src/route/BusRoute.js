const busController = require('../controller/BusController');
const express = require('express');
const router = express.Router();

router.get('/', busController.getAllBuses);

module.exports = router;