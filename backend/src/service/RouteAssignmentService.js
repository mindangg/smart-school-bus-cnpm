const routeAssignmentRepository = require('../repository/RouteAssignmentRepository');
const routeService = require('./RouteService');

const getRouteAssignments = async () => {
    return routeAssignmentRepository.getAllRouteAssignments();
}

const getRouteAssignmentById = async (id) => {
    const route = await routeAssignmentRepository.getRouteAssignmentById(id)
    console.log(route)
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

    const currentAssignment = route.route_assignments && route.route_assignments.length > 0 
        ? route.route_assignments[0] 
        : null;
    
    const currentBus = currentAssignment ? currentAssignment.buses : null;

    const formattedResponse = {
        route_id: route.route_id,
        route_type: route.route_type,
        start_time: route.start_time,
        bus: currentBus ? {
            bus_id: currentBus.bus_id,
            bus_number: currentBus.bus_number,
        } : null,
        stops: route.route_stops.map(routeStop => ({
            stop_id: routeStop.stop.stop_id,
            address: routeStop.stop.address,
            latitude: routeStop.stop.latitude,
            longitude: routeStop.stop.longitude,
            order: routeStop.stop_order,
        })),
    };

    // Phần Mapbox giữ nguyên
    if(formattedResponse.stops && formattedResponse.stops.length >= 2){
        try{
            const coordinates = formattedResponse.stops.map(stop => `${stop.longitude},${stop.latitude}`).join(';');
            const accessToken = process.env.MAPBOX_ACCESS_TOKEN;
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${accessToken}`;

            const mapboxResponse = await axios.get(url);

            if (mapboxResponse.data && mapboxResponse.data.routes && mapboxResponse.data.routes.length > 0) {
                const geometry = mapboxResponse.data.routes[0].geometry;
                formattedResponse.path_geometry = geometry;
            }
        } catch(mapError){
            console.error('Error fetching route geometry from Mapbox:', mapError.message);
            // Không set path_geometry = null để tránh frontend bị lỗi null, 
            // cứ để undefined hoặc null tùy frontend xử lý
            formattedResponse.path_geometry = null;
        }
    }

    return formattedResponse;
};

const getAllSchedules = async () => {
    return routeAssignmentRepository.findAllAssignments();
}

const createRouteAssignment = async (data) => {
    const route_id = data.route_id;
    await routeAssignmentRepository.createRouteAssignment(data);
    const returnRoute = await routeService.getReturnRoute(route_id)
    if (returnRoute) {
        const returnData = {
            ...data,
            route_id: returnRoute.route_id,
        }
        await routeAssignmentRepository.createRouteAssignment(returnData);
    }
}

const deleteRouteAssignment = async (id) => {
    return routeAssignmentRepository.deleteRouteAssignment(id);
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
    createRouteAssignment,
    deleteRouteAssignment,
}