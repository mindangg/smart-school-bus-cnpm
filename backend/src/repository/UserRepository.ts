import { PrismaClient, users } from '@prisma/client'
const prisma = new PrismaClient()

import type { User } from '../utils/interface'

export const getUserByEmail = async (email: string) => {
    return await prisma.users.findUnique({ where: { email } })
}

export const createUser = async (data: users) => {
    return await prisma.users.create({ data })
}

export const loginUser = async (data: { 
    email: string ; password: string
}) => {
    return await prisma.users.create({ data })
}

export const getUsers = async () => {
    return await prisma.users.findMany()
}

export const getUserById = async (user_id: number) => {
    return await prisma.users.findUnique({ where: { user_id } })
}

export const updateUserById = async (user_id: number, data: User) => {
    return await prisma.users.update({
        where: { user_id },
        data,
    })
}

export const deleteUserById = async (user_id: number) => {
    return await prisma.users.delete({ where: { user_id } })
}