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


module.exports = {
    getStudents,
    getStudentsByParent,
    getStudentById,
    createStudent,
    deleteStudent,
    updateStudent
}