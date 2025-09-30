import * as parentRepository from '../repository/ParentRepository'
import type { SignupParentDTO } from '../dto/ParentDTO'
import { toDTO } from '../mapper/ParentMapper'

export const signupParent = async (dto: SignupParentDTO) => {
    const existingParent = await parentRepository.getParentByEmail(dto.email)
    if (existingParent) 
        throw new Error('Email already exists')

    const parent = await parentRepository.signupParent(dto)
    return toDTO(parent)
}

// export const loginParent = async (name: string, email: string) => {
//   const existingUser = await parentRepo.getUserByEmail(email)
//   if (existingUser) 
//     throw new Error('Email already exists')

//   return await loginParent({ name, email })
// }

export const getParents = async () => {
    const parents = await parentRepository.getParents()
    return parents.map(toDTO)
}

export const getParentById = async (id: number) => {
    const parent = await parentRepository.getParentById(id)
    if (!parent)
        return []

    return toDTO(parent)
}

export const updateParent = async (id: number) => {
    const parent = await parentRepository.getParentById(id)
    if (!parent)
        return []

    return toDTO(parent)
}

export const deleteParent = async (id: number) => {
    await parentRepository.deleteParentById(id)

    return
}




