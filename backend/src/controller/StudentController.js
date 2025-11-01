const studentService = require('../service/StudentService')

const createStudent = async (req, res) => {
    try {
        const data = req.body
        const student = await studentService.createStudent(data)
        res.status(201).json(student)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getStudents = async (_req, res) => {
    try {
        const student = await studentService.getStudents()
        res.status(200).json(student)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const getStudentsByParent = async (req, res) => {
    try {
        const student = await studentService.getStudentsByParent(req.user_id)
        res.status(200).json(student)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getStudentById = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        const student = await studentService.getStudentById(parseInt(id, 10))
        res.status(200).json(student)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateStudent = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        const student = await studentService.updateStudent(Number(id), data)
        res.status(200).json(student)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        await studentService.deleteStudent(Number(id))
        res.status(200)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getStudents,
    getStudentsByParent,
    getStudentById,
    createStudent,
    deleteStudent,
    updateStudent
}
