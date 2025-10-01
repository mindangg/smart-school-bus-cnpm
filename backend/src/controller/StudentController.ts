import type { Request, Response } from 'express'
import * as studentService from '../service/StudentService'

export const createStudent = async (req: Request, res: Response) => {
    try {
        const dto = req.body
        const student = await studentService.createStudent(dto)
        res.status(201).json(student)
    } 
    catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const getStudents = async (_req: Request, res: Response) => {
    try {
        const student = await studentService.getStudents()
        res.status(200).json(student)
    } 
    catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const getStudentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        const student = await studentService.getStudentById(parseInt(id, 10))
        res.status(200).json(student)
    } 
    catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const updateStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const dto = req.body

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        const student = await studentService.updateStudent(Number(id), dto)
        res.status(200).json(student)
    } 
    catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        await studentService.deleteStudent(Number(id))
        res.status(200)
    } 
    catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}
