const adminController = require('../controller/AdminController');
const express = require('express');
const {requireAuth} = require("../middleware/requireAuth");
const router = express.Router();

router.use(requireAuth)

router.get('/dashboard', adminController.getDashboardStats);

module.exports = router;