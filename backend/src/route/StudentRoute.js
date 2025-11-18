const express = require('express')

const { requireAuth } = require ('../middleware/requireAuth')
const studentController = require('../controller/StudentController')

const router = express.Router();

router.use(requireAuth)

router.get('/', studentController.getStudents)

router.get('/parent', studentController.getStudentsByParent)

router.get('/:id', studentController.getStudentById)

router.get('/:id/assignment', studentController.getStudentAssignment);

router.post('/', studentController.createStudent)

router.delete('/:id', studentController.deleteStudent)

router.put('/:id', studentController.updateStudent)

router.put(
    '/:studentId/stop',
    requireAuth,
    studentController.updateStudentStops
);

module.exports = router