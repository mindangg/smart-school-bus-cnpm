import express from 'express'

// import requireAuth from '../middlewares/requireAuth'

import {
    loginDriver,
    signupDriver,
    getAllDrivers,
    getDriver,
    deleteDriver,
    updateDriver
} from '../controller/AdminController'

const router = express.Router()

router.post('/login', loginDriver)

router.post('/signup', signupDriver)

// router.use(requireAuth)

router.get('/', getAllDrivers)

router.get('/:id', getDriver)

router.delete('/:id', deleteDriver)

router.put('/:id', updateDriver)

export default router