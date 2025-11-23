const UserRepository = require('../repository/UserRepository')
const bcrypt = require('bcrypt')
const routeAssignmentService = require('./RouteAssignmentService')
const { z } = require('zod')
const jwt = require('jsonwebtoken')

const signupSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Vui lòng nhập email."})
        .email({ message: "Email không hợp lệ"}),

    password: z
        .string()
        .min(6, { message: "Mật khẩu phải ít nhất 6 ký tự." }),

    role: z.string()
})

const createSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Vui lòng nhập email."})
        .email({ message: "Email không hợp lệ"}),

    password: z
        .string()
        .min(6, { message: "Mật khẩu phải ít nhất 6 ký tự." }),

    full_name: z.string().min(1, {
        message: "Vui lòng nhập họ tên.",
    }),

    phone_number: z
        .string()
        .trim()
        .refine(
            (value) => /^(\+84|0)(3|5|7|8|9)\d{8}$/.test(value),
            { message: "Số điện thoại không hợp lệ." }
        ),

    address: z.string().min(1, {
        message: "Vui lòng nhập địa chỉ.",
    }),

    role: z.string()
})

const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: '3d' })
}

const signupUser = async (data) => {
    const parsedData = signupSchema.parse(data)

    const existingUser = await UserRepository.getUserByEmail(parsedData.email)
    if (existingUser)
        throw new Error('Email đã tồn tại')

    const hashedPassword = await bcrypt.hash(parsedData.password, 10)

    const user = await UserRepository.signupUser({ ... parsedData, password: hashedPassword})

    const token = createToken(user.user_id)

    return { user, token }
}

const loginUser = async (data) => {
    const checkUser = await UserRepository.loginUser(data.email)
    if (!checkUser)
        throw new Error('Email không tồn tại.')

    const isMatch = await bcrypt.compare(data.password, checkUser.password)
    if (!isMatch)
        throw new Error("Mật khẩu không đúng.")

    const token = createToken(checkUser.user_id)
    const { password: _, ...user } = checkUser
    return { user, token }
}

const getCurrentUser = async (id) => {
    const user = await UserRepository.getUserById(id)
    if (!user)
        throw new Error('Không có người dùng auth này')

    return user
}

const getUsers = (filter) => {
    return UserRepository.getUsers(filter);
}

const getAvailableDrivers = async () => {
    const allDrivers = await UserRepository.getUsers({ role: 'DRIVER' });
    const allAssignments = await routeAssignmentService.getRouteAssignments();

    const assignedDriverIds = new Set(
        allAssignments
            .filter(assignment => assignment.is_active)
            .map(assignment => assignment.driver_id)
    );

    return allDrivers.filter(
        driver => !assignedDriverIds.has(driver.user_id)
    );
}

const getUserById = async (id) => {
    const userExist = await UserRepository.getUserById(id)
    if (!userExist)
        throw new Error('Người dùng không tồn tại')

    return UserRepository.getUserById(id)
}

const createUser = async (data) => {
    const parsedData = createSchema.parse(data)

    const existingUser = await UserRepository.getUserByEmail(parsedData.email)
    if (existingUser)
        throw new Error('Email đã tồn tại')

    const hashedPassword = await bcrypt.hash(parsedData.password, 10)

    return UserRepository.createUser({...parsedData, password: hashedPassword});
}

const updateUser = async (id, data) => {
    const user = await UserRepository.updateUserById(id, data)
    if (!user)
        return []

    return user
}

const deleteUser = async (id) => {
    await UserRepository.deleteUserById(id)
}

const getTotalDrivers = async () => {
    return UserRepository.countUsersByRole('DRIVER');
}

const getTotalParents = async () => {
    return UserRepository.countUsersByRole('PARENT');
}

module.exports = {
    getAvailableDrivers,
    signupUser,
    loginUser,
    getCurrentUser,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getTotalDrivers,
    getTotalParents
}