const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const upsertAssignment = async (studentId, newRouteStopId) => {
    const routeStopInfo = await prisma.route_stops.findUnique({
        where: { route_stop_id: newRouteStopId },
        include: {
            route: {
                select: {
                    route_id: true,
                    route_type: true 
                }
            }
        }
    });

    if (!routeStopInfo || !routeStopInfo.route) {
        throw new Error("Route Stop or Route info not found");
    }

    const targetRouteType = routeStopInfo.route.route_type;

    const existingAssignment = await prisma.route_stop_students.findFirst({
        where: {
            student_id: studentId,
            route_stop: {
                route: {
                    route_type: targetRouteType 
                }
            }
        }
    });


    if (existingAssignment) {
        return prisma.route_stop_students.update({
            where: { id: existingAssignment.id },
            data: {
                route_stop_id: newRouteStopId
            }
        });
    } else {
        
        return prisma.route_stop_students.create({
            data: {
                student_id: studentId,
                route_stop_id: newRouteStopId
            }
        });
    }
}

const getStudentsAtRouteStop = async (routeStopId) => {
    return prisma.route_stop_students.findMany({
        where: {
            route_stop_id: routeStopId,
        },
        include: {
            student: {
                include: {
                    student_events: true,
                },
            },
        },
    });
}

module.exports = {
    upsertAssignment,
    getStudentsAtRouteStop
}