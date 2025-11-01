const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); 

const findRouteDetailsById = async (routeId) => {
    return await prisma.routes.findUnique({
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
    return await prisma.route_assignments.findMany({
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
    findRouteDetailsById,
    findAllAssignments,
};