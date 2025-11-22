const express = require("express");
const router = express.Router();
const notificationController = require("../controller/NotificationController");
const { requireAuth } = require("../middleware/requireAuth");

router.get("/", requireAuth, notificationController.getMyNotifications);
router.patch("/:notificationId/read", requireAuth, notificationController.markNotificationAsRead);

module.exports = router;