import { PrismaClient, users } from '@prisma/client'
import { userSignupDTO } from '../dto/User'
const prisma = new PrismaClient()

export const getUserByEmail = async (email: string) => {
    return await prisma.users.findUnique({ where: { email } })
}

export const signupUser = async (data: userSignupDTO) => {
    return await prisma.users.create({ data })
}

export const createUser = async (data: userSignupDTO) => {
    return await prisma.users.create({ data })
}

export const getUsers = async () => {
    return await prisma.users.findMany()
}

export const getUserById = async (user_id: number) => {
    return await prisma.users.findUnique({ where: { user_id } })
}

export const updateUserById = async (user_id: number, data: users) => {
    return await prisma.users.update({
        where: { user_id },
        data
    })
}

export const deleteUserById = async (user_id: number) => {
    return await prisma.users.delete({ where: { user_id } })
}