import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.token
    if (!token) {
        res.status(401).json({ message: 'No token, unauthorized' })
        return 
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET as string) as JwtPayload
        (req as any).user_id = decoded.id
        console.log('Decoded payload:', decoded)
        next()
    } 
    catch (error) {
        res.status(401).json({ message: 'Invalid token' })
    }
}
