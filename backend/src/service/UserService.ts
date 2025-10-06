import { users } from '@prisma/client'
import * as userRepository from '../repository/UserRepository'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { userCreateDTO, userLoginDTO, userSignupDTO } from '../dto/User'

const signupSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Vui lòng nhập email."})
        .email({ message: "Email không hợp lệ"}), 

    password: z
        .string()    
        .min(6, { message: "Mật khẩu phải ít nhất 6 ký tự." })
        .regex(/[A-Z]/, { message: "Mật khẩu phải chứa ít nhất 1 ký tự viết hoa." })
        .regex(/[0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 ký tự số." })
        .regex(/[^a-zA-Z0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt." }),
    
    role: z.string()
})

const createSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Vui lòng nhập email."})
        .email({ message: "Email không hợp lệ"}), 

    password: z
        .string()    
        .min(6, { message: "Mật khẩu phải ít nhất 6 ký tự." })
        // .regex(/[A-Z]/, { message: "Mật khẩu phải chứa ít nhất 1 ký tự viết hoa." })
        .regex(/[^a-zA-Z0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt." }),

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

const createToken = (id: number) => {
    return jwt.sign({ id }, process.env.SECRET!, { expiresIn: '3d' })
}

export const signupUser = async (data: userSignupDTO) => {
    const parsedData = signupSchema.parse(data)
    
    const existingUser = await userRepository.getUserByEmail(parsedData.email)
    if (existingUser) 
        throw new Error('Email đã tồn tại')

    const hashedPassword = await bcrypt.hash(parsedData.password, 10)

    const user = await userRepository.signupUser({ ... parsedData, password: hashedPassword})

    const token = createToken(user.user_id)

    return { user, token }
}

export const loginUser = async (data: userLoginDTO) => {
    const checkUser = await userRepository.loginUser(data.email)
    if (!checkUser)
        throw new Error('Email không đúng.')

    const isMatch = await bcrypt.compare(data.password, checkUser.password)
    if (!isMatch)
        throw new Error("Mật khẩu không đúng.")

    const token = createToken(checkUser.user_id)
    const { password: _, ...user } = checkUser
    return { user, token }
}

export const getCurrentUser = async (id: number) => {
    const user = await userRepository.getUserById(id)
    if (!user)
        throw new Error('Không có người dùng auth này')

    return user
}

export const getUsers = async (filter: any) => {
    return await userRepository.getUsers(filter)
}

export const getUserById = async (id: number) => {
    const userExist = await userRepository.getUserById(id)
    if (!userExist) 
        throw new Error('Người dùng không tồn tại')

    return await userRepository.getUserById(id)
}

export const createUser = async (data: userCreateDTO) => {
    const parsedData = createSchema.parse(data)
    
    const existingUser = await userRepository.getUserByEmail(parsedData.email)
    if (existingUser) 
        throw new Error('Email đã tồn tại')

    const hashedPassword = await bcrypt.hash(parsedData.password, 10)

    const user = await userRepository.createUser({ ... parsedData, password: hashedPassword})

    return user
}

export const updateUser = async (id: number, data: users) => {
    const user = await userRepository.updateUserById(id, data)
    if (!user)
        return []

    return user
}

export const deleteUser = async (id: number) => {
    await userRepository.deleteUserById(id)
}




