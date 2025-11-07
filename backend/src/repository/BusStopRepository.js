const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

const findActiveById = async (stopId) => {
    return prisma.bus_stops.findFirst({
            where: { 
                stop_id: stopId,
                is_active: true
            }
        });
}
module.exports = {
    findActiveById
}