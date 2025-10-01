import * as studentRepository from '../repository/StudentRepository'
import type { Student } from '../utils/interface'

export const createStudent = async (data: Student) => {
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

export const updateStudent = async (id: number, data: Student) => {
    const student = await studentRepository.updateStudent(id, data)
    if (!student)
        throw new Error('No student')

    return student
}

export const deleteStudent = async (id: number) => {
    return await studentRepository.deleteStudent(id)
}




