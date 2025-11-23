const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createStudent = async (data) => {
    return prisma.students.create({data})
}

const getStudents = async () => {
    return prisma.students.findMany({
        include: {
            users: true,
        },
    });
}

const getStudentsByParent = async (id) => {
    return prisma.students.findMany({
        where: {parent_id: id},
        include: {
            users: true,
        },
    });
}

const getStudentById = async (student_id) => {
    return prisma.students.findUnique({
        where: {student_id},
        include: {
            users: true,
        },
    });
}

const updateStudent = async (
    student_id,
    data
) => {
    return  prisma.students.update({
        where: { student_id },
        data,
        include: {
            users: true,
        },
    })
}

const deleteStudent = (student_id) => {
    return prisma.students.delete({
        where: {student_id}
    });
}

const getStudentAssignmentDetails = async (studentId) => {
    return prisma.route_stop_students.findFirst({
        where: { student_id: studentId }, // Tìm học sinh trong bảng trung gian
        include: {
            // 1. Lấy thông tin trạm dừng (route_stop) mà học sinh đã đăng ký
            route_stop: {
                include: {
                    // 1a. Lấy chi tiết của trạm dừng đó (tên, địa chỉ, lat/lng)
                    stop: true, 
                    // 1b. Lấy thông tin về Tuyến đường (route) của trạm dừng đó
                    route: {    
                        include: {
                            // === SỬA Ở ĐÂY: Thay 'buses: true' bằng đoạn dưới ===
                            route_assignments: {
                                where: { is_active: true }, // Chỉ lấy xe đang phân công hoạt động
                                include: {
                                    buses: true // Lấy thông tin xe từ bảng phân công
                                }
                            },
                            route_stops: { 
                                include: {
                                    stop: true // Lấy chi tiết của TẤT CẢ trạm dừng
                                },
                                orderBy: {
                                    stop_order: 'asc' // Sắp xếp theo đúng thứ tự
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}

const getTotalStudents = async () => {
    return prisma.students.count();
}


module.exports = {
    getStudents,
    getStudentsByParent,
    getStudentById,
    createStudent,
    deleteStudent,
    updateStudent,
    getStudentAssignmentDetails,
    getTotalStudents
}