const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const getAllBuses = async () => {
    return prisma.buses.findMany()
}

module.exports = {
    getAllBuses,
};