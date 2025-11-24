const express = require("express");
const router = express.Router();
const notificationController = require("../controller/NotificationController");
const { requireAuth } = require("../middleware/requireAuth");

router.use(requireAuth)
router.post('/', notificationController.createNotification)
router.get("/", notificationController.getMyNotifications);
router.patch("/:notificationId/read", notificationController.markNotificationAsRead);

module.exports = router;