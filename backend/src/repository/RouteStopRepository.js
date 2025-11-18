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
                route: { // Kiểm tra lồng, đảm bảo tuyến của trạm này active
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
            route: { is_active: true }, // Đảm bảo tuyến vẫn active
            stop: { is_active: true }   // Đảm bảo trạm vẫn active
        },
        select: {
            route_stop_id: true // Chỉ cần ID của nó
        }
    });
}
module.exports = {
    findStopsByRouteOrdered,
    isStopOnActiveRoute,
    findRouteStop
}