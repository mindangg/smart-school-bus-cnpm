import type { Request, Response } from 'express'
import * as userService from '../service/UserService'

export const signupUser = async (req: Request, res: Response) => {
    try {
        const data = req.body
        const { user, token } = await userService.signupUser(data)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge:  3 * 24 * 60 * 60 * 1000,
        })

        res.status(201).json({ message: "Đăng ký thành công", user })
    } 
    catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const data = req.body
        const { user, token } = await userService.loginUser(data)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge:  3 * 24 * 60 * 60 * 1000,
        })

        res.status(201).json({ message: 'Đăng nhập thành công', user })
    } 
    catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const logoutUser = async (_req: Request, res: Response) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    })
    res.status(200).json({ message: 'Logged out successfully' })
}

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const user = await userService.getCurrentUser((req as any).user_id)
        res.json({ user })
    } 
    catch (error) {
        res.status(401).json({ message: 'Unauthorized' })
    }
}

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
        const data = req.body

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        const user = await userService.updateUser(parseInt(id, 10), data)
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
        res.status(200).json({ message: 'Delete successfully'})
    } 
    catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}
