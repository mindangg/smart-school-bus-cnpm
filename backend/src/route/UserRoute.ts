import express from 'express'

// import requireAuth from '../middlewares/requireAuth'

import {
    // loginParent,
    signupParent,
    getParents,
    // getParentById,
    // deleteParent,
    // updateParent
} from '../controller/UserController'

const router = express.Router()

// router.post('/login', loginParent)

router.post('/signup', signupParent)

// router.use(requireAuth)

router.get('/', getParents)

// router.get('/:id', getParentById)

// router.delete('/:id', deleteParent)

// router.put('/:id', updateParent)

export default router