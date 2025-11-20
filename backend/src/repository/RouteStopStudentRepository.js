const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const upsertAssignment = async (studentId, newRouteStopId) => {
    return prisma.$transaction(async (tx) => {
        await tx.route_stop_students.deleteMany({
            where: { 
                student_id: studentId 
            }
        });

        return tx.route_stop_students.create({
            data: {
                student_id: studentId,
                route_stop_id: newRouteStopId
            }
        });
    });
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