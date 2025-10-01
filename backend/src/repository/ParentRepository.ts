import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getParentByEmail = async (email: string) => {
    return await prisma.parent.findUnique({ where: { email } })
}

export const loginParent = async (data: { 
    email: string ; password: string
}) => {
    return await prisma.parent.create({ data })
}

export const signupParent = async (data: { 
    name: string; email: string ; password: string
}) => {
    return await prisma.parent.create({ data })
}

export const getParents = async () => {
    return await prisma.parent.findMany()
}

export const getParentById = async (id: number) => {
    return await prisma.parent.findUnique({ where: { id } })
}

export const updateParentById = async (id: number, data: { 
    name: string; email: string ; password: string
}) => {
    return await prisma.parent.update({
        where: { id },
        data,
    })
}

export const deleteParentById = async (id: number) => {
    return await prisma.parent.delete({ where: { id } })
}