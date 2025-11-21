const routeService = require('../service/RouteService')


// const getRouteDetails = async (req, res) => {
//     try{
//         const routeId = parseInt(req.params.id)
//         if(isNaN(routeId)){
//             return res.status(400).json({ error: 'Invalid route ID' })
//         }

//         const routeData = await routeService.getRouteById1(routeId)

//         if(!routeData){
//             return res.status(404).json({ error: 'Route not found' })
//         }
//         res.json(routeData)
//     }
//     catch (error) {
//         console.error('Error fetching route details:', error)
//         res.status(500).json({ error: 'Internal server error' })
//     }
// }

// const getAllSchedules = async (req, res) => {
//     try {
//         const schedules = await routeService.getAllSchedules()
//         res.json(schedules)
//     } catch (error) {
//         console.error('Error fetching schedules:', error)
//         res.status(500).json({ error: 'Internal server error' })
//     }
// }

const getRoutes = async (req, res) => {
    const {isAvailable} = req.query
    try {
        if (isAvailable === 'true') {
            const availableRoutes = await routeService.getAvailableRoutes()
            res.status(200).json(availableRoutes)
            return
        }
        const routes = await routeService.getRoutes()
        res.status(200).json(routes)
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getRouteById = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        const route = await routeService.getRouteById(Number(id))
        res.status(200).json(route)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getRouteDirection = async (req, res) => {
    const { start, end } = req.query

    if (!start || !end) {
        return res.status(400).json({ error: "Missing start or end coordinates" })
    }

    const [startLng, startLat] = start.split(',').map(Number)
    const [endLng, endLat] = end.split(',').map(Number)

    if ([startLat, startLng, endLat, endLng].some(isNaN)) {
        return res.status(400).json({ error: "Invalid coordinate format" })
    }

    try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}`;

        const response = await axios.get(url, {
            params: {
                geometries: "geojson",
                access_token: process.env.MAPBOX_ACCESS_TOKEN,
            },
        })

        res.json(response.data)
    }
    catch (error) {
        console.error("Mapbox Directions API error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch directions" });
    }
}

const getRouteDirectionFull = async (req, res) => {
    const { start, end } = req.query

    if (!start || !end) {
        return res.status(400).json({ error: "Missing start or end coordinates" })
    }

    const [startLng, startLat] = start.split(',').map(Number)
    const [endLng, endLat] = end.split(',').map(Number)


    if ([startLat, startLng, endLat, endLng].some(isNaN)) {
        return res.status(400).json({ error: "Invalid coordinate format" })
    }

    try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}`;

        const response = await axios.get(url, {
            params: {
                alternatives: true,
                geometries: "geojson",
                overview: "full",
                steps: true,
                language: "vi",
                access_token: process.env.MAPBOX_ACCESS_TOKEN,
            },
        })

        const route = response.data.routes[0]
        const geometry = route.geometry
        const steps = route.legs.flatMap((leg) => leg.steps)
        const distance = route.distance
        const duration = route.duration

        res.json({
            geometry,
            steps,
            distance,
            duration,
            waypoints: response.data.waypoints,
        })


        // res.json(response.data)
    }
    catch (error) {
        console.error("Mapbox Directions API error:", error.response?.data || error.message)
        res.status(500).json({ error: "Failed to fetch directions" })
    }
}

const createRoute = async (req, res) => {
    try {
        const { start_time, stops, create_return_route, return_start_time } = req.body
        if (!start_time || !stops || !Array.isArray(stops) || stops.length === 0) {
            return res.status(400).json({ message: 'Invalid input data' })
        }
        if (stops.length < 2) {
            return res.status(400).json({ message: 'A route must have at least two stops' })
        }
        const newRoute = await routeService.createRoute(start_time, stops, create_return_route, return_start_time)
        res.status(201).json(newRoute)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

const deleteRoute = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: 'ID is required' })
        }

        await routeService.deleteRoute(Number(id))
        res.status(204).send()
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    // getRouteDetails,
    // getAllSchedules,
    getRoutes,
    getRouteById,
    getRouteDirection,
    getRouteDirectionFull,
    createRoute,
    deleteRoute,
}

