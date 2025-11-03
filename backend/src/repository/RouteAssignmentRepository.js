const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getAllRouteAssignments = async () => {
    return prisma.route_assignments.findMany({
        include: {
            buses: true,
            routes: {
                include: {
                    route_stops: {
                        include: {
                            stop: true,
                        },
                        orderBy: {
                            stop_order: 'asc',
                        },
                    },
                },
            }
        },
    })
}

const getRouteAssignmentById = async (assignment_id) => {
    return prisma.route_assignments.findUnique({
        where: { assignment_id },
        include: {
            buses: true,
            routes: {
                include: {
                    route_stops: {
                        include: {
                            stop: true,
                        },
                        orderBy: {
                            stop_order: 'asc',
                        },
                    },
                },
            }
        },
    })
}

const getRouteAssignmentByDriver = async (driver_id) => {
    return prisma.route_assignments.findMany({
        where: { driver_id },
        include: {
            buses: true,
            routes: {
                include: {
                    route_stops: {
                        include: {
                            stop: true,
                        },
                        orderBy: {
                            stop_order: 'asc',
                        },
                    },
                },
            }
        },
    })
}

//hbao
const findRouteDetailsById = async (routeId) => {
    return prisma.routes.findUnique({
        where: {
            route_id: routeId,
        },
        include: {
            buses: true, // Lấy thông tin xe buýt
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
            routes: {
                select: {
                    route_type: true,
                    start_time: true
                }
            },
            users: {
                select: {
                    full_name: true
                }
            },
            buses: {
                select: {
                    bus_number: true
                }
            }
        },
        orderBy: {
            assignment_date: 'desc'
        }
    });
};

module.exports = {
    getAllRouteAssignments,
    getRouteAssignmentById,
    getRouteAssignmentByDriver,
    findRouteDetailsById,
    findAllAssignments
}