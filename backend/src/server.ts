import express from 'express'
import cors from 'cors'
import type { Request, Response } from 'express'


// import AdminRoute from './route/AdminRoute'
// import DriverRoute from'./route/DriverRoute'
import ParentRoute from'./route/ParentRoute'
// import StudentRoute from'./route/StudentRoute'

const app = express()

app.use(express.json())

app.use((req: Request, _res: Response, next) => {
    console.log(req.path, req.method)
    next()
})

app.use(cors({origin: 'http://localhost:3000'}))

// routes
// app.use('/api/admin', AdminRoute)
// app.use('/api/driver', DriverRoute)
app.use('/api/parent', ParentRoute)
// app.use('/api/student', StudentRoute)

app.get('/', (_req: Request, res: Response) => {
    res.send('Welcome to my app')
})

app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
})
