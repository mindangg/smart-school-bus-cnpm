import * as userRepository from '../repository/UserRepository'
import type { User } from '../utils/interface'
import bcrypt from 'bcrypt'

export const signupUser = async (data: User) => {
    const existingUser = await userRepository.getUserByEmail(data.email)
    if (existingUser) 
        throw new Error('Email already exists')

    const hashedPassword = await bcrypt.hash(data.password, 10)

    return await userRepository.createUser({ ... data, password: hashedPassword})
}

// export const loginUser = async (data: User) => {
//     const existingUser = await userRepo.getUserByEmail(data.email)
//     if (existingUser) 
//         throw new Error('Email already exists')

//     const user = await loginUser(data)
//     return user
// }

export const getUsers = async () => {
    return await userRepository.getUsers()
}

export const getUserById = async (id: number) => {
    const user = await userRepository.getUserById(id)
    if (!user)
        return []

    return user
}

export const updateUser = async (id: number) => {
    const user = await userRepository.getUserById(id)
    if (!user)
        return []

    return user
}

export const deleteUser = async (id: number) => {
    return await userRepository.deleteUserById(id)
}




