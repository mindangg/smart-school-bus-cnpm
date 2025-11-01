const express = require('express')

const { requireAuth } = require ('../middleware/requireAuth')

const {
    getStudents,
    getStudentById,
    createStudent,
    deleteStudent,
    updateStudent
} = require('../controller/StudentController')

const router = express.Router();

router.use(requireAuth)

router.get('/', getStudents)

router.get('/:id', getStudentById)

router.post('/', createStudent)

router.delete('/:id', deleteStudent)

router.put('/:id', updateStudent)

module.exports = router