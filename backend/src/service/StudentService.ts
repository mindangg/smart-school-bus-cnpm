import * as studentRepository from '../repository/StudentRepository'
import type { Student } from '../utils/type'

export const createStudent = async (dto: Student) => {
    const student = await studentRepository.createStudent(dto)

    if (!student)
        throw new Error('Can not create')

    return student
}


export const getStudents = async () => {
    const students = await studentRepository.getStudents()

    if (!students)
        throw new Error('No student')

    return students
}

export const getStudentById = async (id: number) => {
    const student = await studentRepository.getStudentById(id)
    if (!student)
        throw new Error('No student')

    return student
}

export const updateStudent = async (id: number, dto: Student) => {
    const student = await studentRepository.updateStudent(id, dto)
    if (!student)
        throw new Error('No student')

    return student
}

export const deleteStudent = async (id: number) => {
    return await studentRepository.deleteStudent(id)
}




