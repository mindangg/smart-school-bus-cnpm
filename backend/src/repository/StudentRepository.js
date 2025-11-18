const { PrismaClient } = require('@prisma/client')
const { studentGetSelect } = require('../dto/Student')
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
                            // 1b-i. Lấy xe buýt (buses) được gán cho tuyến đường này
                            buses: true, 
                            // 1b-ii. Lấy TẤT CẢ các trạm dừng (route_stops)
                            //        thuộc tuyến đường này
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


module.exports = {
    getStudents,
    getStudentsByParent,
    getStudentById,
    createStudent,
    deleteStudent,
    updateStudent,
    getStudentAssignmentDetails
}