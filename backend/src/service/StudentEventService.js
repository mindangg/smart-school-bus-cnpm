const studentEventRepository = require('../repository/StudentEventRepository')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const notificationService = require('../service/NotificationService')

const createStudentEvent = async (data) => {
    const studentEvent = await studentEventRepository.createStudentEvent(data)

    if (!studentEvent)
        throw new Error('Can not create')

    return studentEvent
}

const getStudentEvents = async () => {
    return studentEventRepository.getStudentEvents();
}

const getStudentEventsByStudent = async (id) => {
    return studentEventRepository.getStudentEventsByStudent(id);
}

const getStudentEventById = async (id) => {
    const studentEvent = await studentEventRepository.getStudentEventById(id)
    if (!studentEvent)
        throw new Error('No student')

    return studentEvent
}

const updateStudentEvent = async (id, data) => {
    const studentEvent = await studentEventRepository.updateStudentEvent(id, data)
    if (!studentEvent)
        throw new Error('No student')

    return studentEvent
}

const deleteStudentEvent = async (id) => {
    return studentEventRepository.deleteStudentEvent(id)
}

// Logic driver thao tác thì cũng phải liên kết tới notification service
const createPickupStudentEvent = async (data) => {
    const { student_id, event_type } = data

    let studentEvent = await studentEventRepository.createPickupStudentEvent(data)

    const student = await prisma.students.findUnique({
        where: { student_id },
        include: {
            users: {
                select: {
                    user_id: true,
                    full_name: true
                }
            }
        }
    })

    if (!student?.users) {
        return studentEvent
    }

    const parentId = student.users.user_id

    const titles = {
        'PICKED UP': 'Con bạn đã được đón lên xe',
        'DROPPED OFF': 'Con bạn đã đến trường an toàn',
        'ABSENT': 'Con bạn vắng mặt tại điểm đón',
        'PICK UP': 'Con bạn đã được đón lên xe'
    }

    const messages = {
        'PICKED UP': `${student.full_name} đã lên xe buýt lúc ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
        'DROPPED OFF': `${student.full_name} đã đến trường an toàn! Chúc bé một ngày học vui vẻ`,
        'ABSENT': `${student.full_name} không có mặt tại điểm đón hôm nay. Tài xế đã chờ 2 phút và tiếp tục hành trình.`,
        'PICK UP': `${student.full_name} đã lên xe buýt lúc ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`  // Optional fix: thêm nếu cần
    }

    await notificationService.createNotification({
        user_id: parentId,
        notification_type: 'STUDENT_EVENT',
        title: titles[event_type] || 'Cập nhật từ tài xế',
        message: messages[event_type] || 'Có cập nhật trạng thái học sinh',
        event_id: studentEvent.event_id,
        is_read: false
    })

    return studentEvent
}

module.exports = {
    getStudentEvents,
    getStudentEventsByStudent,
    getStudentEventById,
    createStudentEvent,
    deleteStudentEvent,
    updateStudentEvent,
    createPickupStudentEvent
}