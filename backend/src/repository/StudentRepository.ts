import { PrismaClient, students } from '@prisma/client'
const prisma = new PrismaClient()

const mapStudent = (student: students) => ({
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

export const createStudent = async (data: students) => {
    const student = await prisma.students.create({ data })

    return student ? mapStudent(student) : null
}

export const getStudents = async () => {
    const students = await prisma.students.findMany()

    return students ? students.map(mapStudent) : []
}

export const getStudentById = async (student_id: number) => {
    const student = await prisma.students.findUnique({ 
        where: { student_id } 
    })

    return student ? mapStudent(student) : null
}

export const updateStudent = async (
    student_id: number,
    data: students
) => {
    const student = await prisma.students.update({
        where: { student_id },
        data
    })

    return student ? mapStudent(student) : null
}

export const deleteStudent = async (student_id: number) => {
    return await prisma.students.delete({ 
        where: { student_id } 
    })
}