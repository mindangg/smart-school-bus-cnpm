const studentRepository = require('../repository/StudentRepository')
const routeStopRepository = require('../repository/RouteStopRepository')
const busStopRepository = require('../repository/BusStopRepository')

const routeStopStudentRepository = require('../repository/RouteStopStudentRepository')
const routeRepository = require('../repository/RouteRepository')

const createStudent = async (data) => {
    const student = await studentRepository.createStudent(data)

    if (!student)
        throw new Error('Can not create')

    return student
}

const getStudents = async () => {
    return studentRepository.getStudents();
}

const getStudentsByParent = async (id) => {
    return studentRepository.getStudentsByParent(id);
}

const getStudentById = async (id) => {
    const student = await studentRepository.getStudentById(id)
    if (!student)
        throw new Error('No student')

    return student
}

const updateStudent = async (id, data) => {
    const student = await studentRepository.updateStudent(id, data)
    if (!student)
        throw new Error('No student')

    return student
}

const deleteStudent = async (id) => {
    await studentRepository.deleteStudent(id)
}

const updateStudentStops = async (parentId, studentId, newRouteId, newStopId) => {
    const student = await studentRepository.getStudentById(studentId);
    if (!student) throw new Error('Student not found');
    if (student.parent_id !== parentId) throw new Error('Unauthorized');

    
    const selectedRouteStop = await routeStopRepository.findRouteStop(newRouteId, newStopId);
    if (!selectedRouteStop) {
        throw new Error('This stop is not valid on the selected route.');
    }

    const mainAssignment = await routeStopStudentRepository.upsertAssignment(
        studentId, 
        selectedRouteStop.route_stop_id
    );

    try {
        const returnRoute = await routeRepository.getReturnRoute(newRouteId);

        if (returnRoute) {
            
            const returnRouteStop = await routeStopRepository.findRouteStop(
                returnRoute.route_id, 
                newStopId
            );

            if (returnRouteStop) {
                await routeStopStudentRepository.upsertAssignment(
                    studentId,
                    returnRouteStop.route_stop_id
                );
                console.log(`Đã tự động đăng ký tuyến về (Route ${returnRoute.route_id}) cho học sinh ${studentId}`);
            }
        }
    } catch (error) {
        console.error("Lỗi khi tự động đăng ký tuyến về:", error.message);
    }

    return mainAssignment;
 }

  

const getStudentAssignment = async (studentId) => {
    const assignment = await studentRepository.getStudentAssignmentDetails(studentId);
    
    if (!assignment) {
        return null; 
    }
    
    return assignment;
}

module.exports = {
    getStudents,
    getStudentsByParent,
    getStudentById,
    createStudent,
    deleteStudent,
    updateStudent,
    updateStudentStops,
    getStudentAssignment
}
