const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const mapStudent = (student) => ({
    student_id: student.student_id,
    full_name: student.full_name,
    profile_photo_url: student.profile_photo_url ?? undefined,
    is_active: student.is_active,

    // ...(student.stop_id !== null && student.stop_id !== undefined
    // ? { stop_id: student.stop_id }
    // : {}),
    // ...(student.users !== null && student.stop_id !== undefined
    // ? { stop_id: student.stop_id }
    // : {}),
    // ...(student.stop_id !== null && student.stop_id !== undefined
    // ? { stop_id: student.stop_id }
    // : {}),
    // ...(student.stop_id !== null && student.stop_id !== undefined
    // ? { stop_id: student.stop_id }
    // : {})
})

const createStudent = async (data) => {
    const student = await prisma.students.create({ data })

    return student ? mapStudent(student) : null
}

const getStudents = async () => {
    const students = await prisma.students.findMany()

    return students ? students.map(mapStudent) : []
}

const getStudentById = async (student_id) => {
    const student = await prisma.students.findUnique({
        where: { student_id }
    })

    return student ? mapStudent(student) : null
}

const updateStudent = async (
    student_id,
    data
) => {
    const student = await prisma.students.update({
        where: { student_id },
        data
    })

    return student ? mapStudent(student) : null
}

const deleteStudent = (student_id) => {
    return prisma.students.delete({
        where: {student_id}
    });
}

module.exports = {
    getStudents,
    getStudentById,
    createStudent,
    deleteStudent,
    updateStudent
}