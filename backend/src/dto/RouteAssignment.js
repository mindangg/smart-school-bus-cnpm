const routeAssignmentGetSelect = {
    buses: true,
    routes: {
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
    }
}

module.exports = { routeAssignmentGetSelect }