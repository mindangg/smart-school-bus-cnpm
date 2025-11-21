const busController = require('../controller/BusController');
const express = require('express');
const {requireAuth} = require("../middleware/requireAuth");
const router = express.Router();

router.use(requireAuth)

router.get('/', busController.getAllBuses);

module.exports = router;