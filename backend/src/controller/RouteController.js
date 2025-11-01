const routeService = require('../service/RouteService');

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
};
module.exports = {
    getRouteDetails,
    getAllSchedules,
};