const busService = require('./BusService');
const routeService = require('./RouteService');
const studentService = require('./StudentService');
const userService = require('./UserService');

const getDashboardStats = async () => {
    const totalBuses = await busService.getTotalBuses();
    const totalRoutes = await routeService.getTotalRoutes();
    const totalStudents = await studentService.getTotalStudents();
    const totalDrivers = await userService.getTotalDrivers();
    const totalParents = await userService.getTotalParents();

    return {
        totalBuses,
        totalRoutes,
        totalStudents,
        totalDrivers,
        totalParents
    };
};

module.exports = {
    getDashboardStats
};