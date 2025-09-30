import express from 'express'

// import requireAuth from '../middlewares/requireAuth'

import {
    loginAdmin,
    signupAdmin,
    getAllAdmins,
    getAdmin,
    deleteAdmin,
    updateAdmin
} from '../controller/AdminController'

const router = express.Router()

router.post('/login', loginAdmin)

router.post('/signup', signupAdmin)

// router.use(requireAuth)

router.get('/', getAllAdmins)

router.get('/:id', getAdmin)

router.delete('/:id', deleteAdmin)

router.put('/:id', updateAdmin)

export default router