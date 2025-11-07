const { findStopsByRouteOrdered } = require("../repository/RouteStopRepository");

const findStopsByRoute = async (routeId) => {
    const routeStops = await findStopsByRouteOrdered(routeId);
        
        // Map lại để trả về dữ liệu trạm dừng gọn gàng
        return routeStops.map(rs => ({
            ...rs.stop, // Thông tin trạm (id, address, lat, lng)
            stop_order: rs.stop_order
        }));
}
module.exports = {
    findStopsByRoute
}