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
module.exports = {
    findStopsByRouteOrdered,
    isStopOnActiveRoute
}