const routesData = [
    // === TUYẾN 1 – MORNING ===
    {
        route: { route_id: 1, route_type: "MORNING", bus_id: 1, start_time: "06:00" },
        stops: [
            { stop_id: 28, stop_order: 1, stop_type: "PICKUP" },
            { stop_id: 12, stop_order: 2, stop_type: "PICKUP" },
            { stop_id: 15, stop_order: 3, stop_type: "PICKUP" },
            { stop_id: 13, stop_order: 4, stop_type: "PICKUP" },
            { stop_id: 14, stop_order: 5, stop_type: "PICKUP" },
            { stop_id: 7,  stop_order: 6, stop_type: "PICKUP" },
            { stop_id: 1,  stop_order: 7, stop_type: "DROPOFF" },
        ],
    },
    // === TUYẾN 1 – AFTERNOON ===
    {
        route: { route_id: 2, route_type: "AFTERNOON", bus_id: 1, start_time: "17:00" },
        stops: [
            { stop_id: 1,  stop_order: 1, stop_type: "PICKUP" },
            { stop_id: 7,  stop_order: 2, stop_type: "PICKUP" },
            { stop_id: 14, stop_order: 3, stop_type: "PICKUP" },
            { stop_id: 13, stop_order: 4, stop_type: "PICKUP" },
            { stop_id: 15, stop_order: 5, stop_type: "PICKUP" },
            { stop_id: 12, stop_order: 6, stop_type: "PICKUP" },
            { stop_id: 28, stop_order: 7, stop_type: "DROPOFF" },
        ],
    },

    // === TUYẾN 2 – MORNING ===
    {
        route: { route_id: 3, route_type: "MORNING", bus_id: 2, start_time: "06:10" },
        stops: [
            { stop_id: 29, stop_order: 1, stop_type: "PICKUP" },
            { stop_id: 17, stop_order: 2, stop_type: "PICKUP" },
            { stop_id: 16, stop_order: 3, stop_type: "PICKUP" },
            { stop_id: 19, stop_order: 4, stop_type: "PICKUP" },
            { stop_id: 21, stop_order: 5, stop_type: "PICKUP" },
            { stop_id: 3,  stop_order: 6, stop_type: "PICKUP" },
            { stop_id: 2,  stop_order: 7, stop_type: "DROPOFF" },
        ],
    },
    // === TUYẾN 2 – AFTERNOON ===
    {
        route: { route_id: 4, route_type: "AFTERNOON", bus_id: 2, start_time: "17:10" },
        stops: [
            { stop_id: 2,  stop_order: 1, stop_type: "PICKUP" },
            { stop_id: 3,  stop_order: 2, stop_type: "PICKUP" },
            { stop_id: 21, stop_order: 3, stop_type: "PICKUP" },
            { stop_id: 19, stop_order: 4, stop_type: "PICKUP" },
            { stop_id: 16, stop_order: 5, stop_type: "PICKUP" },
            { stop_id: 17, stop_order: 6, stop_type: "PICKUP" },
            { stop_id: 29, stop_order: 7, stop_type: "DROPOFF" },
        ],
    },

    // === TUYẾN 3 – MORNING ===
    {
        route: { route_id: 5, route_type: "MORNING", bus_id: 3, start_time: "06:15" },
        stops: [
            { stop_id: 25, stop_order: 1, stop_type: "PICKUP" },
            { stop_id: 24, stop_order: 2, stop_type: "PICKUP" },
            { stop_id: 23, stop_order: 3, stop_type: "PICKUP" },
            { stop_id: 22, stop_order: 4, stop_type: "PICKUP" },
            { stop_id: 26, stop_order: 5, stop_type: "PICKUP" },
            { stop_id: 27, stop_order: 6, stop_type: "PICKUP" },
            { stop_id: 3,  stop_order: 7, stop_type: "DROPOFF" },
        ],
    },
    // === TUYẾN 3 – AFTERNOON ===
    {
        route: { route_id: 6, route_type: "AFTERNOON", bus_id: 3, start_time: "17:15" },
        stops: [
            { stop_id: 3,  stop_order: 1, stop_type: "PICKUP" },
            { stop_id: 27, stop_order: 2, stop_type: "PICKUP" },
            { stop_id: 26, stop_order: 3, stop_type: "PICKUP" },
            { stop_id: 22, stop_order: 4, stop_type: "PICKUP" },
            { stop_id: 23, stop_order: 5, stop_type: "PICKUP" },
            { stop_id: 24, stop_order: 6, stop_type: "PICKUP" },
            { stop_id: 25, stop_order: 7, stop_type: "DROPOFF" },
        ],
    },

    // === TUYẾN 4 – MORNING ===
    {
        route: { route_id: 7, route_type: "MORNING", bus_id: 4, start_time: "06:20" },
        stops: [
            { stop_id: 30, stop_order: 1, stop_type: "PICKUP" },
            { stop_id: 8,  stop_order: 2, stop_type: "PICKUP" },
            { stop_id: 9,  stop_order: 3, stop_type: "PICKUP" },
            { stop_id: 10, stop_order: 4, stop_type: "PICKUP" },
            { stop_id: 11, stop_order: 5, stop_type: "PICKUP" },
            { stop_id: 19, stop_order: 6, stop_type: "PICKUP" },
            { stop_id: 4,  stop_order: 7, stop_type: "DROPOFF" },
        ],
    },
    // === TUYẾN 4 – AFTERNOON ===
    {
        route: { route_id: 8, route_type: "AFTERNOON", bus_id: 4, start_time: "17:20" },
        stops: [
            { stop_id: 4,  stop_order: 1, stop_type: "PICKUP" },
            { stop_id: 19, stop_order: 2, stop_type: "PICKUP" },
            { stop_id: 11, stop_order: 3, stop_type: "PICKUP" },
            { stop_id: 10, stop_order: 4, stop_type: "PICKUP" },
            { stop_id: 9,  stop_order: 5, stop_type: "PICKUP" },
            { stop_id: 8,  stop_order: 6, stop_type: "PICKUP" },
            { stop_id: 30, stop_order: 7, stop_type: "DROPOFF" },
        ],
    },

    // === TUYẾN 5 – MORNING ===
    {
        route: { route_id: 9, route_type: "MORNING", bus_id: 5, start_time: "06:30" },
        stops: [
            { stop_id: 21, stop_order: 1, stop_type: "PICKUP" },
            { stop_id: 24, stop_order: 2, stop_type: "PICKUP" },
            { stop_id: 25, stop_order: 3, stop_type: "PICKUP" },
            { stop_id: 23, stop_order: 4, stop_type: "PICKUP" },
            { stop_id: 26, stop_order: 5, stop_type: "PICKUP" },
            { stop_id: 27, stop_order: 6, stop_type: "PICKUP" },
            { stop_id: 5,  stop_order: 7, stop_type: "DROPOFF" },
        ],
    },
    // === TUYẾN 5 – AFTERNOON ===
    {
        route: { route_id: 10, route_type: "AFTERNOON", bus_id: 5, start_time: "17:30" },
        stops: [
            { stop_id: 5,  stop_order: 1, stop_type: "PICKUP" },
            { stop_id: 27, stop_order: 2, stop_type: "PICKUP" },
            { stop_id: 26, stop_order: 3, stop_type: "PICKUP" },
            { stop_id: 23, stop_order: 4, stop_type: "PICKUP" },
            { stop_id: 25, stop_order: 5, stop_type: "PICKUP" },
            { stop_id: 24, stop_order: 6, stop_type: "PICKUP" },
            { stop_id: 21, stop_order: 7, stop_type: "DROPOFF" },
        ],
    },

    // === TUYẾN 6 – MORNING ===
    {
        route: { route_id: 11, route_type: "MORNING", bus_id: 6, start_time: "06:40" },
        stops: [
            { stop_id: 29, stop_order: 1, stop_type: "PICKUP" },
            { stop_id: 12, stop_order: 2, stop_type: "PICKUP" },
            { stop_id: 15, stop_order: 3, stop_type: "PICKUP" },
            { stop_id: 13, stop_order: 4, stop_type: "PICKUP" },
            { stop_id: 14, stop_order: 5, stop_type: "PICKUP" },
            { stop_id: 7,  stop_order: 6, stop_type: "PICKUP" },
            { stop_id: 6,  stop_order: 7, stop_type: "DROPOFF" },
        ],
    },
    // === TUYẾN 6 – AFTERNOON ===
    {
        route: { route_id: 12, route_type: "AFTERNOON", bus_id: 6, start_time: "17:40" },
        stops: [
            { stop_id: 6,  stop_order: 1, stop_type: "PICKUP" },
            { stop_id: 7,  stop_order: 2, stop_type: "PICKUP" },
            { stop_id: 14, stop_order: 3, stop_type: "PICKUP" },
            { stop_id: 13, stop_order: 4, stop_type: "PICKUP" },
            { stop_id: 15, stop_order: 5, stop_type: "PICKUP" },
            { stop_id: 12, stop_order: 6, stop_type: "PICKUP" },
            { stop_id: 29, stop_order: 7, stop_type: "DROPOFF" },
        ],
    },

    // === TUYẾN 7 – MORNING ===
    {
        route: { route_id: 13, route_type: "MORNING", bus_id: 7, start_time: "06:50" },
        stops: [
            { stop_id: 28, stop_order: 1, stop_type: "PICKUP" },
            { stop_id: 30, stop_order: 2, stop_type: "PICKUP" },
            { stop_id: 8,  stop_order: 3, stop_type: "PICKUP" },
            { stop_id: 11, stop_order: 4, stop_type: "PICKUP" },
            { stop_id: 19, stop_order: 5, stop_type: "PICKUP" },
            { stop_id: 14, stop_order: 6, stop_type: "PICKUP" },
            { stop_id: 7,  stop_order: 7, stop_type: "DROPOFF" },
        ],
    },
    // === TUYẾN 7 – AFTERNOON ===
    {
        route: { route_id: 14, route_type: "AFTERNOON", bus_id: 7, start_time: "17:50" },
        stops: [
            { stop_id: 7,  stop_order: 1, stop_type: "PICKUP" },
            { stop_id: 14, stop_order: 2, stop_type: "PICKUP" },
            { stop_id: 19, stop_order: 3, stop_type: "PICKUP" },
            { stop_id: 11, stop_order: 4, stop_type: "PICKUP" },
            { stop_id: 8,  stop_order: 5, stop_type: "PICKUP" },
            { stop_id: 30, stop_order: 6, stop_type: "PICKUP" },
            { stop_id: 28, stop_order: 7, stop_type: "DROPOFF" },
        ],
    },
];

module.exports = routesData;
