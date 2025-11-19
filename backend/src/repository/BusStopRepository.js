const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

const getAllBusStops = async () => {
    return prisma.bus_stops.findMany();
}
const findActiveById = async (stopId) => {
    return prisma.bus_stops.findFirst({
        where: {
            stop_id: stopId,
            is_active: true
        }
    });
}
module.exports = {
    getAllBusStops,
    findActiveById
}