const routeStopStudentService = require("../service/RouteStopStudentService");

const getStudentsAtRouteStop = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        const students = await routeStopStudentService.getStudentsAtRouteStop(Number(id));
        res.status(200).json(students)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getStudentsAtRouteStop
}