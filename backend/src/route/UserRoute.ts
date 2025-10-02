import express from 'express'

// import requireAuth from '../middlewares/requireAuth'

import {
    loginUser,
    signupUser,
    getUsers,
    getUserById,
    deleteUser,
    updateUser
} from '../controller/UserController'

const router = express.Router()

router.post('/login', loginUser)

router.post('/signup', signupUser)

// router.use(requireAuth)

router.get('/', getUsers)

router.get('/:id', getUserById)

router.delete('/:id', deleteUser)

router.put('/:id', updateUser)

export default router