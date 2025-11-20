// src/repository/RouteStopStudentRepository.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Cập nhật phân công trạm dừng cho học sinh.
 * Sử dụng Transaction để đảm bảo sạch dữ liệu: Xóa cũ -> Tạo mới.
 */
const upsertAssignment = async (studentId, newRouteStopId) => {
    
    // Sử dụng transaction để đảm bảo tính toàn vẹn
    return prisma.$transaction(async (tx) => {
        
        // 1. Xóa TẤT CẢ phân công cũ của học sinh này (để tránh dư thừa data rác)
        await tx.route_stop_students.deleteMany({
            where: { 
                student_id: studentId 
            }
        });

        // 2. Tạo bản ghi mới
        const newAssignment = await tx.route_stop_students.create({
            data: {
                student_id: studentId,
                route_stop_id: newRouteStopId
            }
        });

        return newAssignment;
    });
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