const studentEventService = require('../service/StudentEventService')

const createStudentEvent = async (req, res) => {
    try {
        const data = req.body
        const studentEvent = await studentEventService.createStudentEvent(data)
        res.status(201).json(studentEvent)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getStudentEvents = async (_req, res) => {
    try {
        const studentEvents = await studentEventService.getStudentEvents()
        res.status(200).json(studentEvents)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getStudentEventsByStudent = async (req, res) => {
    const { id } = req.params

    if (!id) {
        res.status(400).json({ message: 'ID is required' })
        return
    }

    try {
        const studentEvent = await studentEventService.getStudentEventsByStudent(Number(id))
        res.status(200).json(studentEvent)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getStudentEventById = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        const student = await studentEventService.getStudentEventById(Number(id))
        res.status(200).json(student)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateStudentEvent = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        const studentEvent = await studentEventService.updateStudentEvent(Number(id), data)
        res.status(200).json(studentEvent)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteStudentEvent = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        await studentEventService.deleteStudentEvent(Number(id))
        res.status(200)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getStudentEvents,
    getStudentEventsByStudent,
    getStudentEventById,
    createStudentEvent,
    deleteStudentEvent,
    updateStudentEvent
}
