const express = require('express')

const { requireAuth } = require ('../middleware/requireAuth')

const {
    getStudents,
    getStudentsByParent,
    getStudentById,
    createStudent,
    deleteStudent,
    updateStudent
} = require('../controller/StudentController')

const router = express.Router();

router.use(requireAuth)

router.get('/', getStudents)

router.get('/parent', getStudentsByParent)

router.get('/:id', getStudentById)

router.post('/', createStudent)

router.delete('/:id', deleteStudent)

router.put('/:id', updateStudent)

module.exports = router