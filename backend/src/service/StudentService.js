const StudentRepository = require('../repository/StudentRepository')

const createStudent = async (data) => {
    const student = await StudentRepository.createStudent(data)

    if (!student)
        throw new Error('Can not create')

    return student
}

const getStudents = async () => {
    return await StudentRepository.getStudents()
}

const getStudentById = async (id) => {
    const student = await StudentRepository.getStudentById(id)
    if (!student)
        throw new Error('No student')

    return student
}

const updateStudent = async (id, data) => {
    const student = await StudentRepository.updateStudent(id, data)
    if (!student)
        throw new Error('No student')

    return student
}

const deleteStudent = async (id) => {
    return await StudentRepository.deleteStudent(id)
}

module.exports = {
    getStudents,
    getStudentById,
    createStudent,
    deleteStudent,
    updateStudent
}
