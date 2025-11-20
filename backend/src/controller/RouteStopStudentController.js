const { findStopsByRoute } = require("../service/RouteStopService");
const studentService = require("../service/StudentService");

const getStudentsAtRouteStop = async (req, res) => {
    try {
        const students = await studentService.getStudents()
        res.status(200).json(students)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getStudentsAtRouteStop
}