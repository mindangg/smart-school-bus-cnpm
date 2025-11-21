const express = require('express')

const { requireAuth } = require ('../middleware/requireAuth')
const studentEventController = require('../controller/StudentEventController')

const router = express.Router();

router.use(requireAuth)

router.get('/', studentEventController.getStudentEvents)

router.get('/student/:id', studentEventController.getStudentEventsByStudent)

router.get('/:id', studentEventController.getStudentEventById)

router.post('/', studentEventController.createStudentEvent)

router.delete('/:id', studentEventController.deleteStudentEvent)

router.put('/stop_student', studentEventController.createPickupStudentEvent)

router.put('/:id', studentEventController.updateStudentEvent)

module.exports = router