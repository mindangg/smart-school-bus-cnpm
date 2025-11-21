const studentRepository = require('../repository/StudentRepository')
const routeStopRepository = require('../repository/RouteStopRepository')
const busStopRepository = require('../repository/BusStopRepository')

const routeStopStudentRepository = require('../repository/RouteStopStudentRepository')


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
    if (!student) {
        throw new Error('Student not found');
    }
    if (student.parent_id !== parentId) {
        throw new Error('Unauthorized');
    }

    const routeStop = await routeStopRepository.findRouteStop(newRouteId, newStopId);

    if (!routeStop) {
        throw new Error('This stop is not valid or not active on the selected route.');
    }

    const newRouteStopId = routeStop.route_stop_id;
    const updatedAssignment = await routeStopStudentRepository.upsertAssignment(
        studentId, 
        newRouteStopId
    );

    return updatedAssignment;
 }

const getStudentAssignment = async (studentId) => {
    const assignment = await studentRepository.getStudentAssignmentDetails(studentId);
    
    if (!assignment) {
        return null; // Trả về null nếu học sinh chưa đăng ký
    }
    
    // Trả về toàn bộ dữ liệu (frontend sẽ tự xử lý)
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
