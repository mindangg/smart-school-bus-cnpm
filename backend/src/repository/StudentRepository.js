const { PrismaClient } = require('@prisma/client')
const { studentGetSelect } = require('../dto/Student')
const prisma = new PrismaClient()

const createStudent = async (data) => {
    const student = await prisma.students.create({ data })

    return student ? mapStudent(student) : null
}

const getStudents = async () => {
    return prisma.students.findMany({
        select: studentGetSelect
    });
}

const getStudentsByParent = async (id) => {
    return prisma.students.findMany({
        where: {parent_id: id},
        select: studentGetSelect
    });
}

const getStudentById = async (student_id) => {
    return prisma.students.findUnique({
        where: {student_id},
        select: studentGetSelect
    });
}

const updateStudent = async (
    student_id,
    data
) => {
    return  prisma.students.update({
        where: { student_id },
        data,
        select: studentGetSelect
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