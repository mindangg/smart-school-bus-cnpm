const { PrismaClient } = require('@prisma/client');
const {studentGetSelect} = require("../dto/Student");
const prisma = new PrismaClient(); 

// const findRouteDetailsById = async (routeId) => {
//     return prisma.routes.findUnique({
//         where: {
//             route_id: routeId,
//         },
//         include: {
//             buses: true, // Lấy thông tin xe buýt
//             route_stops: { // Lấy các trạm dừng của tuyến
//                 orderBy: {
//                     stop_order: 'asc', // Sắp xếp theo thứ tự
//                 },
//                 include: {
//                     stop: true, // Lấy thông tin chi tiết của trạm
//                 },
//             },
//         },
//     });
// };

// const findAllAssignments = async () => {
//     return prisma.route_assignments.findMany({
//         include: {
//             routes: {
//                 select: {
//                     route_type: true,
//                     start_time: true
//                 }
//             },
//             users: {
//                 select: {
//                     full_name: true
//                 }
//             },
//             buses: {
//                 select: {
//                     bus_number: true
//                 }
//             }
//         },
//         orderBy: {
//             assignment_date: 'desc'
//         }
//     });
// };

const getAllRoutes = async () => {
    return prisma.routes.findMany({
        include: {
            route_stops: {
                include: {stop: true},
                orderBy: {stop_order: 'asc'},
            },
        },
    })
}

const getRouteById = async (route_id) => {
    return prisma.routes.findUnique({
        where: { route_id },
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
    })
}


module.exports = {
    // findRouteDetailsById,
    // findAllAssignments,
    getAllRoutes,
    getRouteById
}