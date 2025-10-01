import express from 'express'

// import requireAuth from '../middlewares/requireAuth'

import {
    getStudents,
    getStudentById,
    createStudent,
    deleteStudent,
    updateStudent
} from '../controller/StudentController'

const router = express.Router()

// router.use(requireAuth)

router.get('/', getStudents)

router.get('/:id', getStudentById)

router.post('/', createStudent)

router.delete('/:id', deleteStudent)

router.put('/:id', updateStudent)

export default router