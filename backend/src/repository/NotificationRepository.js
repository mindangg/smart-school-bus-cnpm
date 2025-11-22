const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createNotification = async (data) => {
    return prisma.notifications.create({
        data,
        include: {
            event: true,
            user: {
                select: { full_name: true, email: true }
            }
        }
    });
};

const getNotificationsByUserId = async (userId) => {
    return prisma.notifications.findMany({
        where: { user_id: userId },
        select: {
            notification_id: true,
            title: true,
            message: true,
            notification_type: true,
            is_read: true,
            created_at: true,
            event_id: true,
        },
        orderBy: { created_at: 'desc' }
    });
};

const markAsRead = async (notificationId) => {
    return prisma.notifications.update({
        where: { notification_id: notificationId },
        data: { is_read: true }
    });
};

module.exports = {
    createNotification,
    getNotificationsByUserId,
    markAsRead
};