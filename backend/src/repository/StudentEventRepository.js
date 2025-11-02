const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createStudentEvent = async (data) => {
    return prisma.student_events.create({data})
}

const getStudentEvents = async () => {
    return prisma.student_events.findMany({
        include: {
            route_assignments: {
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
            },
        },
    })
}

const getStudentEventsByStudent = async (student_id) => {
    return prisma.student_events.findMany({
        where: {student_id},
        include: {
            route_assignments: {
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
            },
        },
    })
}

const getStudentEventById = async (event_id) => {
    return prisma.student_events.findUnique({
        where: {event_id},
        include: {
            route_assignments: {
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
            },
        },
    })
}

const updateStudentEvent = async (
    event_id,
    data
) => {
    return  prisma.student_events.update({
        where: { event_id },
        data,
    })
}

const deleteStudentEvent = (event_id) => {
    return prisma.student_events.delete({
        where: {event_id}
    })
}

module.exports = {
    getStudentEvents,
    getStudentEventsByStudent,
    getStudentEventById,
    createStudentEvent,
    deleteStudentEvent,
    updateStudentEvent
}