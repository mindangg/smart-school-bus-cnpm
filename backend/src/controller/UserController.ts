import type { Request, Response } from 'express'
import * as userService from '../service/UserService'

export const signupUser = async (req: Request, res: Response) => {
    try {
        const data = req.body
        const user = await userService.signupUser(data)
        res.status(201).json(user)
    } 
    catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

// export const loginUser = async (req: Request, res: Response) => {
//     try {
//         const { email, password } = req.body
//         const user = await userService.loginUser(email, password)
//         res.status(201).json(user)
//     } 
//     catch (error: any) {
//         res.status(400).json({ message: error.message })
//     }
// }

export const getUsers = async (_req: Request, res: Response) => {
    try {
        const user = await userService.getUsers()
        res.status(200).json(user)
    } 
    catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        const user = await userService.getUserById(parseInt(id, 10))
        res.status(200).json(user)
    } 
    catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        const user = await userService.updateUser(parseInt(id, 10))
        res.status(200).json(user)
    } 
    catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        await userService.deleteUser(parseInt(id, 10))
        res.status(200)
    } 
    catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}
