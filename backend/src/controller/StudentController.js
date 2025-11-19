const studentService = require('../service/StudentService')

const createStudent = async (req, res) => {
    try {
        const data = req.body
        const student = await studentService.createStudent(data)
        res.status(201).json(student)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getStudents = async (_req, res) => {
    try {
        const student = await studentService.getStudents()
        res.status(200).json(student)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const getStudentsByParent = async (req, res) => {
    try {
        const student = await studentService.getStudentsByParent(req.user_id)
        res.status(200).json(student)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getStudentById = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        const student = await studentService.getStudentById(parseInt(id, 10))
        res.status(200).json(student)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateStudent = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        const student = await studentService.updateStudent(Number(id), data)
        res.status(200).json(student)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        await studentService.deleteStudent(Number(id))
        res.status(200).json({ message: 'Delete successfully'})
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// update cho diem ruoc va diem don
const updateStudentStops = async (req, res, next) => {
    try {
            const parentId = req.user_id; 
            
            if (!parentId) {
                throw new Error('Authentication error: User ID not found.');
            }

            const studentId = parseInt(req.params.studentId, 10);
            
            // === SỬA TẠI ĐÂY: Lấy thêm routeId từ body ===
            const { stopId, routeId } = req.body; 

            if (!stopId || !routeId) { // Kiểm tra cả 2
                throw new Error('Stop ID and Route ID are required');
            }

            // === SỬA TẠI ĐÂY: Truyền đủ 4 tham số ===
            const updatedStudent = await studentService.updateStudentStops(
                parentId,
                studentId,
                parseInt(routeId, 10), // Tham số 3: Route ID
                parseInt(stopId, 10)   // Tham số 4: Stop ID
            );
            
            res.status(200).json(updatedStudent);
        } catch (error) {
            next(error);
        }
}

const getStudentAssignment = async (req, res, next) => {
    try {
        const studentId = parseInt(req.params.id, 10); // Lấy id từ URL
        if (isNaN(studentId)) {
            throw new Error('Invalid Student ID');
        }
        
        const assignmentData = await studentService.getStudentAssignment(studentId);
        
        // Trả về null (không phải lỗi) nếu không tìm thấy
        res.status(200).json(assignmentData); 
    } catch (error) {
        next(error);
    }
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
