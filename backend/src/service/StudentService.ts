import { students } from '@prisma/client'
import * as studentRepository from '../repository/StudentRepository'

export const createStudent = async (data: students) => {
    const student = await studentRepository.createStudent(data)

    if (!student)
        throw new Error('Can not create')

    return student
}

export const getStudents = async () => {
    return await studentRepository.getStudents()
}

export const getStudentById = async (id: number) => {
    const student = await studentRepository.getStudentById(id)
    if (!student)
        throw new Error('No student')

    return student
}

export const updateStudent = async (id: number, data: students) => {
    const student = await studentRepository.updateStudent(id, data)
    if (!student)
        throw new Error('No student')

    return student
}

export const deleteStudent = async (id: number) => {
    return await studentRepository.deleteStudent(id)
}




