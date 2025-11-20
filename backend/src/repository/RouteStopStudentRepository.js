// src/repository/RouteStopStudentRepository.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// (Hoặc import file prisma chung của bạn: const prisma = require('../../lib/prisma');)


/**
 * Cập nhật hoặc Tạo mới (Upsert) một đăng ký trạm dừng cho học sinh.
 * Đây là logic bạn đã có trong Service.
 */
const upsertAssignment = async (studentId, newRouteStopId) => {
    
    // 1. Tìm xem học sinh đã có đăng ký nào chưa
    const existingAssignment = await prisma.route_stop_students.findFirst({
        where: { student_id: studentId }
        // Lưu ý: Giả định 1 học sinh chỉ có 1 đăng ký.
        // Nếu dùng @@unique([student_id]), hãy đổi .findFirst
        // thành .findUnique({ where: { student_id: studentId }})
    });

    let resultAssignment;
    if (existingAssignment) {
        // 2. Nếu đã tồn tại, cập nhật
        resultAssignment = await prisma.route_stop_students.update({
            where: { id: existingAssignment.id }, // Cập nhật bằng ID của bản ghi
            data: { route_stop_id: newRouteStopId }
        });
    } else {
        // 3. Nếu chưa, tạo mới
        resultAssignment = await prisma.route_stop_students.create({
            data: {
                student_id: studentId,
                route_stop_id: newRouteStopId
            }
        });
    }

    return resultAssignment;
}

const getStudentsAtRouteStop = async (routeStopId) => {
    return prisma.route_stop_students.findMany({
        where: {
            route_stop_id: routeStopId,
        },
        select: {
            student: true,
        },
    });
}

module.exports = {
    upsertAssignment,
    getStudentsAtRouteStop
}