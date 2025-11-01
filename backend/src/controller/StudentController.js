const StudentService = require('../service/StudentService')

const createStudent = async (req, res) => {
    try {
        const data = req.body
        const student = await StudentService.createStudent(data)
        res.status(201).json(student)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const getStudents = async (_req, res) => {
    try {
        const student = await StudentService.getStudents()
        res.status(200).json(student)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const getStudentById = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        const student = await StudentService.getStudentById(parseInt(id, 10))
        res.status(200).json(student)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
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

        const student = await StudentService.updateStudent(Number(id), data)
        res.status(200).json(student)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        await StudentService.deleteStudent(Number(id))
        res.status(200)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

module.exports = {
    getStudents,
    getStudentById,
    createStudent,
    deleteStudent,
    updateStudent
}
