const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const getAllBusStops = async () => {
    return prisma.bus_stops.findMany();
}

module.exports = {
    getAllBusStops,
};