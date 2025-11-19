const routeRepository = require('../repository/RouteRepository');
const routeAssignmentService = require('./RouteAssignmentService');
const axios = require('axios');
const UserRepository = require("../repository/UserRepository");
const studentRepository = require("../repository/StudentRepository");

// const getRouteById1 = async (routeId) => {
//     const route = await routeRepository.findRouteDetailsById(routeId);

//     if (!route) {
//         return null;
//     }

//     const formattedResponse = {
//         route_id: route.route_id,
//         route_type: route.route_type,
//         start_time: route.start_time,
//         bus: route.buses ? { 
//             bus_id: route.buses.bus_id,
//             bus_number: route.buses.bus_number,
//             license_plate: route.buses.license_plate,
//         } : null,
//         stops: route.route_stops.map(routeStop => ({
//             stop_id: routeStop.stop.stop_id,
//             address: routeStop.stop.address,
//             latitude: routeStop.stop.latitude,
//             longitude: routeStop.stop.longitude,
//             order: routeStop.stop_order,
//         })),
//     };

//     if(formattedResponse.stops && formattedResponse.stops.length >= 2){
//         try{
//             const coordinates = formattedResponse.stops.map(stop => `${stop.longitude},${stop.latitude}`).join(';');
//             const accessToken = process.env.MAPBOX_ACCESS_TOKEN;
//             const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${accessToken}`;

//             const mapboxResponse = await axios.get(url);

//             if (mapboxResponse.data && mapboxResponse.data.routes && mapboxResponse.data.routes.length > 0) {
                
//                 // 'geometry' là một đối tượng GeoJSON LineString
//                 // chứa tất cả các điểm tọa độ của con đường
//                 const geometry = mapboxResponse.data.routes[0].geometry;
                
//                 // Thêm lộ trình này vào kết quả trả về 
//                 formattedResponse.path_geometry = geometry;
//             }
//         } catch(mapError){
//             console.error('Error fetching route geometry from Mapbox:', mapError.message);
//             formattedResponse.path_geometry = null;
//         }
//     }

//     return formattedResponse;
// };

// const getAllSchedules = async () => {
//     const assignments = await routeRepository.findAllAssignments();

//     return assignments.map(a => ({
//         assignment_id: a.assignment_id,
//         route_id: a.route_id, 
//         bus_number: a.buses.bus_number,
//         route_name: a.routes.route_type === 'MORNING' ? 'Tuyến Sáng' : 'Tuyến Chiều',
//         driver_name: a.users.full_name,
//         start_time: a.routes.start_time,
//         status: a.is_active ? 'Sắp chạy' : 'Hoàn thành', 
//     }));
// }

const getRoutes = async () => {
    return routeRepository.getAllRoutes();
}

const getRouteById = async (id) => {
    const route = await routeRepository.getRouteById(id)
    if (!route)
        throw new Error('No route')

    return route
}

const getAvailableRoutes = async () => {
    const allRoutes = await routeRepository.getAllRoutes();
    const allAssignments = await routeAssignmentService.getRouteAssignments();

    const assignedRouteIds = new Set(
        allAssignments
            .filter(assignment => assignment.is_active)
            .map(assignment => assignment.route_id)
    );

    return allRoutes.filter(
        route => !assignedRouteIds.has(route.route_id)
    );
}

module.exports = {
    // getRouteById1,
    // getAllSchedules,
    getAvailableRoutes,
    getRoutes,
    getRouteById
}