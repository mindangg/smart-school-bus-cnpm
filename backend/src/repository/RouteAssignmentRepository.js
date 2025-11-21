const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const {routeAssignmentGetSelect} = require('../dto/RouteAssignment')

const getAllRouteAssignments = async () => {
    return prisma.route_assignments.findMany({
        include: routeAssignmentGetSelect
    })
}

const getRouteAssignmentById = async (assignment_id) => {
    return prisma.route_assignments.findUnique({
        where: {assignment_id},
        include: {
            users: {
                select: {
                    user_id: true,
                    full_name: true,
                    phone_number: true
                }
            },

            buses: {
                select: {
                    bus_id: true,
                    bus_number: true,
                }
            },

            routes: {
                select: {
                    route_id: true,
                    route_type: true,
                    start_time: true,

                    route_stops: {
                        orderBy: { stop_order: "asc" },
                        include: {
                            stop: true
                        }
                    }
                }
            }
        }
    })
}

const getRouteAssignmentByDriver = async (driver_id) => {
    return prisma.route_assignments.findMany({
        where: {driver_id},
        include: routeAssignmentGetSelect
    })
}

const getRouteAssignmentByRouteId = async (route_id) => {
    return prisma.route_assignments.findMany({
        where: {route_id},
    })
}

const getRouteAssignmentByDriverId = async (driver_id) => {
    return prisma.route_assignments.findMany({
        where: {driver_id},
    })
}

const getRouteAssignmentByBusId = async (bus_id) => {
    return prisma.route_assignments.findMany({
        where: {bus_id},
    })
}

//hbao
const findRouteDetailsById = async (routeId) => {
    return prisma.routes.findUnique({
        where: {
            route_id: routeId,
        },
        include: {
            route_assignments: {
                where: {is_active: true}, // Chỉ lấy xe đang được phân công chạy
                include: {
                    buses: true // Lấy thông tin xe từ bảng assignment
                }
            }, // Lấy thông tin xe buýt
            route_stops: { // Lấy các trạm dừng của tuyến
                orderBy: {
                    stop_order: 'asc', // Sắp xếp theo thứ tự
                },
                include: {
                    stop: true, // Lấy thông tin chi tiết của trạm
                },
            },
        },
    });
};

const findAllAssignments = async () => {
    return prisma.route_assignments.findMany({
        include: {
            users: {
                select: {
                    user_id: true,
                    full_name: true,
                    phone_number: true
                }
            },

            buses: {
                select: {
                    bus_id: true,
                    bus_number: true,
                }
            },

            routes: {
                select: {
                    route_id: true,
                    route_type: true,
                    start_time: true,

                    route_stops: {
                        orderBy: { stop_order: "asc" },
                        include: {
                            stop: true
                        }
                    }
                }
            }
        }
    });
}


const createRouteAssignment = async (data) => {
    return prisma.route_assignments.create({
        data
    });
}

const deleteRouteAssignment = async (assignment_id) => {
    return prisma.route_assignments.delete({
        where: {assignment_id}
    });
}

module.exports = {
    getAllRouteAssignments,
    getRouteAssignmentById,
    getRouteAssignmentByDriver,
    findRouteDetailsById,
    findAllAssignments,
    getRouteAssignmentByRouteId,
    getRouteAssignmentByDriverId,
    getRouteAssignmentByBusId,
    createRouteAssignment,
    deleteRouteAssignment
}