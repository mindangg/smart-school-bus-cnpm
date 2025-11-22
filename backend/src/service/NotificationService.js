const notificationRepository = require('../repository/NotificationRepository');

const createNotification = async (data) => {
    return notificationRepository.createNotification(data);
};

const getNotificationsByUserId = async (userId) => {
    return notificationRepository.getNotificationsByUserId(userId);
};

const markAsRead = async (notificationId) => {
    return notificationRepository.markAsRead(notificationId);
};

module.exports = {
    createNotification,
    getNotificationsByUserId,
    markAsRead
};