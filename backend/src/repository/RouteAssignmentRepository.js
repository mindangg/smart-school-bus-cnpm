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

module.exports = {
    getAllRouteAssignments,
    getRouteAssignmentById,
    getRouteAssignmentByDriver
}