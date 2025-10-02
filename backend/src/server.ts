import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import type { Request, Response } from 'express'

import UserRoute from'./route/UserRoute'
import StudentRoute from'./route/StudentRoute'

const app = express()

app.use(express.json())

app.use((req: Request, _res: Response, next) => {
    console.log(req.path, req.method)
    next()
})

app.use(cors({origin: 'http://localhost:3000'}))
app.use(cookieParser())

// routes

app.use('/api/users', UserRoute)
app.use('/api/students', StudentRoute)

app.get('/', (_req: Request, res: Response) => {
    res.send('Welcome to my app')
})

app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
})
