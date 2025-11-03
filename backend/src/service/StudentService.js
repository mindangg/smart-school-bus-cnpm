const studentRepository = require('../repository/StudentRepository')

const createStudent = async (data) => {
    const student = await studentRepository.createStudent(data)

    if (!student)
        throw new Error('Can not create')

    return student
}

const getStudents = async () => {
    return studentRepository.getStudents();
}

const getStudentsByParent = async (id) => {
    return studentRepository.getStudentsByParent(id);
}

const getStudentById = async (id) => {
    const student = await studentRepository.getStudentById(id)
    if (!student)
        throw new Error('No student')

    return student
}

const updateStudent = async (id, data) => {
    const student = await studentRepository.updateStudent(id, data)
    if (!student)
        throw new Error('No student')

    return student
}

const deleteStudent = async (id) => {
    return studentRepository.deleteStudent(id)
}

module.exports = {
    getStudents,
    getStudentsByParent,
    getStudentById,
    createStudent,
    deleteStudent,
    updateStudent
}
