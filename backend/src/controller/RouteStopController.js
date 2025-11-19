const { findStopsByRoute } = require("../service/RouteStopService");

const getStopsForRoute = async (req, res,next) => {
    try {
            const routeId = parseInt(req.params.routeId, 10);
            if (isNaN(routeId)) {
                throw new Error('Invalid Route ID');
            }
            const stops = await findStopsByRoute(routeId);
            res.status(200).json(stops);
        } catch (error) {
            next(error);
        }
}
module.exports = {
    getStopsForRoute
}