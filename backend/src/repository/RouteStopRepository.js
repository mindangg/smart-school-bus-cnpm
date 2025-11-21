const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()
const findStopsByRouteOrdered = async (routeId) => {
    return prisma.route_stops.findMany({
            where: {
                route_id: routeId,
                route: {
                    is_active: true
                },
                stop: {
                    is_active: true
                }
            },
            include: {
                stop: true // Lấy thông tin chi tiết của trạm dừng
            },
            orderBy: {
                stop_order: 'asc' // Sắp xếp theo thứ tự
            }
        });
}

const isStopOnActiveRoute = async (stopId) => {
    const count = await prisma.route_stops.count({
            where: {
                stop_id: stopId,
                route: {
                    is_active: true
                }
            }
        });
        return count > 0;
}

const findRouteStop = async (routeId, stopId) => {
    return prisma.route_stops.findFirst({
        where: {
            route_id: routeId,
            stop_id: stopId,
            route: { is_active: true },
            stop: { is_active: true }
        },
        select: {
            route_stop_id: true
        }
    });
}

const createRouteStopsForRoute = async (routeId, stops) => {
    return prisma.route_stops.createMany({
        data: stops.map((stop) => ({
            route_id: routeId,
            stop_id: stop.stop_id,
            stop_order: stop.stop_order
        })),
        skipDuplicates: true,
    });
}

module.exports = {
    findStopsByRouteOrdered,
    isStopOnActiveRoute,
    findRouteStop,
    createRouteStopsForRoute,
}