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
            // SỬA DÒNG NÀY:
            // Đọc trực tiếp 'user_id' từ 'req', không qua 'req.user'
            const parentId = req.user_id; 
            
            // (Đảm bảo req.user_id tồn tại)
            if (!parentId) {
                throw new Error('Authentication error: User ID not found.');
            }

            const studentId = parseInt(req.params.studentId, 10);
            const { stopId } = req.body; 

            if (!stopId) {
                throw new Error('Stop ID is required');
            }

            const updatedStudent = await studentService.updateStudentStops(
                parentId,
                studentId,
                parseInt(stopId, 10)
            );
            
            res.status(200).json(updatedStudent);
        } catch (error) {
            next(error); // Chuyển lỗi cho middleware xử lý (đã thêm ở lần trước)
        }
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
