import { PrismaClient, users } from '@prisma/client'
import { userCreateDTO, userSignupDTO, userGetSelect } from '../dto/User'
const prisma = new PrismaClient()

export const getUserByEmail = async (email: string) => {
    return await prisma.users.findUnique({ where: { email }, select: userGetSelect })
}

export const signupUser = async (data: userSignupDTO) => {
    return await prisma.users.create({ data, select: userGetSelect })
}
export const loginUser = async (email: string) => {
    return await prisma.users.findUnique({
        where: { email },
        select: {
            ...userGetSelect,
            password: true
        }
    })
}

export const createUser = async (data: userCreateDTO) => {
    return await prisma.users.create({ data, select: userGetSelect })
}

export const getUsers = async (filter: any) => {
    return await prisma.users.findMany({ 
        where: filter,
        select: userGetSelect 
    })
}

export const getUserById = async (user_id: number) => {
    return await prisma.users.findUnique({ where: { user_id }, select: userGetSelect })
}

export const updateUserById = async (user_id: number, data: users) => {
    return await prisma.users.update({
        where: { user_id },
        data,
        select: userGetSelect
    })
}

export const deleteUserById = async (user_id: number) => {
    return await prisma.users.delete({ where: { user_id } })
}