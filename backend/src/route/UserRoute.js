const express = require('express')

const { requireAuth } = require ('../middleware/requireAuth')

const userController = require('../controller/UserController')

const router = express.Router()

router.post('/login', userController.loginUser)

router.post('/signup', userController.signupUser)

router.post('/logout', userController.logoutUser)

router.use(requireAuth)

router.get('/', userController.getUsers)

router.get('/current', userController.getCurrentUser)

router.get('/:id', userController.getUserById)

router.post('/', userController.createUser)

router.delete('/:id', userController.deleteUser)

router.put('/:id', userController.updateUser)

module.exports = router