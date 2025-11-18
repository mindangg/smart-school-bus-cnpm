const routeAssignmentRepository = require('../repository/RouteAssignmentRepository');
const axios = require('axios');

const getRouteAssignments = async () => {
    return routeAssignmentRepository.getAllRouteAssignments();
}

const getRouteAssignmentById = async (id) => {
    const route = await routeAssignmentRepository.getRouteAssignmentById(id)
    if (!route)
        throw new Error('No route')

    return route
}
const getRouteAssignmentByDriver = async (id) => {
    const route = await routeAssignmentRepository.getRouteAssignmentByDriver(id)
    if (!route)
        throw new Error('No route')

    return route
}

const getRouteAssignmentByRouteId = async (id) => {
    const route = await routeAssignmentRepository.getRouteAssignmentByRouteId(id)
    if (!route)
        throw new Error('No route')
    return route
}


const getRouteAssignmentByDriverId = async (id) => {
    const route = await routeAssignmentRepository.getRouteAssignmentByDriverId(id)
    if (!route)
        throw new Error('No route')

    return route
}

const getRouteAssignmentByBusId = async (id) => {
    const route = await routeAssignmentRepository.getRouteAssignmentByBusId(id)
    if (!route)
        throw new Error('No route')

    return route
}


//hbao
const getRouteById = async (routeId) => {
    const route = await routeAssignmentRepository.findRouteDetailsById(routeId);

    if (!route) {
        return null;
    }

    const formattedResponse = {
        route_id: route.route_id,
        route_type: route.route_type,
        start_time: route.start_time,
        bus: route.buses ? { 
            bus_id: route.buses.bus_id,
            bus_number: route.buses.bus_number,
            license_plate: route.buses.license_plate,
        } : null,
        stops: route.route_stops.map(routeStop => ({
            stop_id: routeStop.stop.stop_id,
            address: routeStop.stop.address,
            latitude: routeStop.stop.latitude,
            longitude: routeStop.stop.longitude,
            order: routeStop.stop_order,
        })),
    };

    if(formattedResponse.stops && formattedResponse.stops.length >= 2){
        try{
            const coordinates = formattedResponse.stops.map(stop => `${stop.longitude},${stop.latitude}`).join(';');
            const accessToken = process.env.MAPBOX_ACCESS_TOKEN;
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${accessToken}`;

            const mapboxResponse = await axios.get(url);

            if (mapboxResponse.data && mapboxResponse.data.routes && mapboxResponse.data.routes.length > 0) {
                
                // 'geometry' là một đối tượng GeoJSON LineString
                // chứa tất cả các điểm tọa độ của con đường
                const geometry = mapboxResponse.data.routes[0].geometry;
                
                // Thêm lộ trình này vào kết quả trả về 
                formattedResponse.path_geometry = geometry;
            }
        } catch(mapError){
            console.error('Error fetching route geometry from Mapbox:', mapError.message);
            formattedResponse.path_geometry = null;
        }
    }

    return formattedResponse;
};

const getAllSchedules = async () => {
    const assignments = await routeAssignmentRepository.findAllAssignments();

    return assignments.map(a => ({
        assignment_id: a.assignment_id,
        route_id: a.route_id, 
        bus_number: a.buses.bus_number,
        route_name: a.routes.route_type === 'MORNING' ? 'Tuyến Sáng' : 'Tuyến Chiều',
        driver_name: a.users.full_name,
        start_time: a.routes.start_time,
        status: a.is_active ? 'Sắp chạy' : 'Hoàn thành', 
    }));
}

const createRouteAssignment = async (data) => {
    return routeAssignmentRepository.createRouteAssignment(data);
}

module.exports = {
    getRouteAssignments,
    getRouteAssignmentById,
    getRouteAssignmentByDriver,
    getRouteById,
    getAllSchedules,
    getRouteAssignmentByRouteId,
    getRouteAssignmentByDriverId,
    getRouteAssignmentByBusId,
    createRouteAssignment
}