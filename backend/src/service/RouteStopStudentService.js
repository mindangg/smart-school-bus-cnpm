const routeStopStudentRepository = require('../repository/RouteStopStudentRepository')

const getStudentsAtRouteStop = async (routeStopId) => {
    const students = await routeStopStudentRepository.getStudentsAtRouteStop(routeStopId)

    if (!students)
        throw new Error('No student')

    return students
}

module.exports = {
    getStudentsAtRouteStop
}