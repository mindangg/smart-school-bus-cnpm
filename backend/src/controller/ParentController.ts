import type { Request, Response } from 'express'
import * as parentService from '../service/ParentService'
import type { SignupParentDTO } from '../dto/ParentDTO'

export const signupParent = async (req: Request, res: Response) => {
    try {
        const dto: SignupParentDTO = req.body
        const parent = await parentService.signupParent(dto)
        res.status(201).json(parent)
    } 
    catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

// export const loginParent = async (req: Request, res: Response) => {
//     try {
//         const { email, password } = req.body
//         const parent = await parentService.loginParent(email, password)
//         res.status(201).json(parent)
//     } 
//     catch (error: any) {
//         res.status(400).json({ message: error.message })
//     }
// }

export const getParents = async (_req: Request, res: Response) => {
    try {
        const parent = await parentService.getParents()
        res.status(200).json(parent)
    } 
    catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const getParentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        const parent = await parentService.getParentById(parseInt(id, 10))
        res.status(200).json(parent)
    } 
    catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const updateParent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        const parent = await parentService.updateParent(parseInt(id, 10))
        res.status(200).json(parent)
    } 
    catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const deleteParent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        await parentService.deleteParent(parseInt(id, 10))
        res.status(200)
    } 
    catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}
