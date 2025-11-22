const { PrismaClient } = require('@prisma/client');
const { userGetSelect } = require('../dto/User')
const prisma = new PrismaClient()

const getUserByEmail = (email) => {
    return prisma.users.findUnique({ where: { email }, select: userGetSelect })
}

const signupUser = (data) => {
    return prisma.users.create({data, select: userGetSelect});
}

const loginUser = (email) => {
    return prisma.users.findUnique({
        where: {email},
        select: {
            ...userGetSelect,
            password: true
        }
    });
}

const createUser = (data) => {
    return prisma.users.create({ data, select: userGetSelect })
}

const getUsers = (filter) => {
    return prisma.users.findMany({
        where: filter,
        select: userGetSelect
    })
}

const getUserById = (user_id) => {
    return prisma.users.findUnique({ where: { user_id }, select: userGetSelect })
}

const updateUserById = (user_id, data) => {
    return prisma.users.update({
        where: { user_id },
        data,
        select: userGetSelect
    })
}

const deleteUserById =(user_id) => {
    return prisma.users.delete({where: {user_id}});
}

const countUsersByRole = async (role) => {
    return prisma.users.count({
        where: { role }
    });
}

module.exports = {
    getUserByEmail,
    signupUser,
    loginUser,
    getUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById,
    countUsersByRole
}