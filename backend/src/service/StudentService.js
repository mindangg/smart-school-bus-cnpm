const studentRepository = require('../repository/StudentRepository')
const routeStopRepository = require('../repository/RouteStopRepository')
const busStopRepository = require('../repository/BusStopRepository')


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

const updateStudentStops = async (parentId, studentId, newStopId) => {
    const student = await studentRepository.getStudentById(studentId);
        if (!student) {
            throw new Error('Student not found');
        }

        // 2. Kiểm tra bảo mật: Phụ huynh có đúng là cha/mẹ của học sinh?
        if (student.parent_id !== parentId) {
            throw new Error('Unauthorized');
        }

        // 3. Kiểm tra trạm dừng mới có hợp lệ không?
        const newStop = await busStopRepository.findActiveById(newStopId);
        if (!newStop) {
            throw new Error('Selected bus stop is not valid or inactive');
        }

        // 4. (Tùy chọn) Kiểm tra xem trạm dừng mới có thuộc 1 tuyến đang hoạt động không?
        const isStopOnActiveRoute = await routeStopRepository.isStopOnActiveRoute(newStopId);
        if (!isStopOnActiveRoute) {
            throw new Error('This stop is not part of any active route.');
        }

        // 5. Cập nhật
        return studentRepository.updateStudent(studentId, { stop_id: newStopId });
 }

module.exports = {
    getStudents,
    getStudentsByParent,
    getStudentById,
    createStudent,
    deleteStudent,
    updateStudent,
    updateStudentStops
}
