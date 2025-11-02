const studentEventRepository = require('../repository/StudentEventRepository')

const createStudentEvent = async (data) => {
    const studentEvent = await studentEventRepository.createStudentEvent(data)

    if (!studentEvent)
        throw new Error('Can not create')

    return studentEvent
}

const getStudentEvents = async () => {
    return studentEventRepository.getStudentEvents();
}

const getStudentEventsByStudent = async (id) => {
    return studentEventRepository.getStudentEventsByStudent(id);
}

const getStudentEventById = async (id) => {
    const studentEvent = await studentEventRepository.getStudentEventById(id)
    if (!studentEvent)
        throw new Error('No student')

    return studentEvent
}

const updateStudentEvent = async (id, data) => {
    const studentEvent = await studentEventRepository.updateStudentEvent(id, data)
    if (!studentEvent)
        throw new Error('No student')

    return studentEvent
}

const deleteStudentEvent = async (id) => {
    return studentEventRepository.deleteStudentEvent(id)
}

module.exports = {
    getStudentEvents,
    getStudentEventsByStudent,
    getStudentEventById,
    createStudentEvent,
    deleteStudentEvent,
    updateStudentEvent
}
