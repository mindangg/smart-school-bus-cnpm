const notificationService = require('../service/NotificationService');

const getMyNotifications = async (req, res) => {
    try {
        // ƯU TIÊN 1: Lấy từ token (khi đã đăng nhập thật)
        // ƯU TIÊN 2: Fallback để test nhanh bằng query (rất tiện demo Postman)
        const userId = req.user_id || req.query.user_id || req.query.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized – Vui lòng đăng nhập hoặc dùng ?user_id để test"
            });
        }

        const notifications = await notificationService.getNotificationsByUserId(Number(userId));
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: error.message || "Lỗi server" });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await notificationService.markAsRead(Number(notificationId));
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMyNotifications,
    markNotificationAsRead
};