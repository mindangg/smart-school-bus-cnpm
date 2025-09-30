import express from 'express'

// import requireAuth from '../middlewares/requireAuth'

import {
    getAllStudents
    getStudent,
    createStudent,
    deleteStudent,
    updateStudent
} from '../controller/StudentController.js'

const router = express.Router()

// router.use(requireAuth)

router.get('/', getAllStudents)

router.get('/:id', getStudent)

router.post('/', createStudent)

router.delete('/:id', deleteStudent)

router.put('/:id', updateStudent)

export default router