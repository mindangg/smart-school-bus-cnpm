const userService = require('../service/UserService')

const signupUser = async (req, res) => {
    try {
        const data = req.body
        const { user, token } = await userService.signupUser(data)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge:  3 * 24 * 60 * 60 * 1000,
        })

        res.status(201).json({ message: "Đăng ký thành công", user })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const data = req.body
        const { user, token } = await userService.loginUser(data)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge:  3 * 24 * 60 * 60 * 1000,
        })

        res.status(201).json({ message: 'Đăng nhập thành công', user })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const logoutUser = async (_req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    })
    res.status(200).json({ message: 'Logged out successfully' })
}

const getCurrentUser = async (req, res) => {
    try {
        const user = await userService.getCurrentUser(req.user_id)
        res.json({ user })
    }
    catch (error) {
        res.status(401).json({ message: 'Unauthorized' })
    }
}

const getUsers = async (req, res) => {
    try {
        const { role } = req.query

        let filter = {}

        if (role)
            filter.role = role

        const user = await userService.getUsers(filter)
        res.status(200).json(user)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        const user = await userService.getUserById(parseInt(id, 10))
        res.status(200).json(user)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const createUser = async (req, res) => {
    try {
        const data = req.body
        const user = await userService.createUser(data)

        res.status(201).json({ message: "Tạo thành công", user })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        const user = await userService.updateUser(parseInt(id, 10), data)
        res.status(200).json(user)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(400).json({ message: 'ID is required' })
            return
        }

        await userService.deleteUser(parseInt(id, 10))
        res.status(200).json({ message: 'Delete successfully'})
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

module.exports = {
    signupUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}
