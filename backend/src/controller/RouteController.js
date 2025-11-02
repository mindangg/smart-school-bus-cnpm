const routeService = require('../service/RouteService')
const axios = require('axios')

const getRouteDetails = async (req, res) => {
    try{
        const routeId = parseInt(req.params.id);
        if(isNaN(routeId)){
            return res.status(400).json({ error: 'Invalid route ID' });
        }

        const routeData = await routeService.getRouteById(routeId);

        if(!routeData){
            return res.status(404).json({ error: 'Route not found' });
        }
        res.json(routeData);
    }
    catch (error) {
        console.error('Error fetching route details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getAllSchedules = async (req, res) => {
    try {
        const schedules = await routeService.getAllSchedules();
        res.json(schedules);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getRouteDirection = async (req, res) => {
    const { start, end } = req.query

    if (!start || !end) {
        return res.status(400).json({ error: "Missing start or end coordinates" })
    }

    try {
        const response = await axios.get(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}.json`,
            {
                params: {
                    geometries: "geojson",
                    access_token: process.env.MAPBOX_TOKEN,
                },
            }
        )

        res.json(response.data)
    }
    catch (error) {
        console.error("Mapbox Directions API error:", error.message)
        res.status(500).json({ error: "Failed to fetch directions" })
    }
}


module.exports = {
    getRouteDetails,
    getAllSchedules,
    getRouteDirection
}

