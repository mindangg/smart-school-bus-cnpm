import express from 'express'

// import { requireAuth } from '../middleware/requireAuth'

import {
    loginUser,
    signupUser,
    logoutUser,
    getCurrentUser,
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser
} from '../controller/UserController'

const router = express.Router()

router.post('/login', loginUser)

router.post('/signup', signupUser)

router.post('/logout', logoutUser)

// router.use(requireAuth)

router.get('/', getUsers)

router.get('/current', getCurrentUser)

router.get('/:id', getUserById)

router.post('/', createUser)

router.delete('/:id', deleteUser)

router.put('/:id', updateUser)

export default router