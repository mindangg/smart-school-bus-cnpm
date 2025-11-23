const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const getAllBuses = async () => {
    return prisma.buses.findMany()
}

const getTotalBuses = async () => {
    return prisma.buses.count()
}

const createBus = async (bus) => {
    return prisma.buses.create({
        data: bus
    })
}

const deleteBus = async (busId) => {
    return prisma.buses.delete({
        where: {
            bus_id: busId
        }
    })
}

module.exports = {
    getAllBuses,
    getTotalBuses,
    createBus,
    deleteBus
};