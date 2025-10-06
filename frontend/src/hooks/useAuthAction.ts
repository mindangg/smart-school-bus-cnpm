'use client'

import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'
import api from '@/lib/axios'
import { toast } from "sonner"

export const useAuthAction = () => {
    const { user, loading, dispatch } = useContext(AuthContext)

    const signup = async (email: string, password: string) => {
        try {
            dispatch({ type: 'LOADING' })

            const res = await api.post('/api/users/signup', {
                email: email,
                password: password,
                role: 'Parent'
            })

            toast.success('Đăng ký thành công.')
            dispatch({ type: 'LOGIN', payload: res.data.user })

        }
        catch (err: any) {
            console.error(err)
            dispatch({ type: 'LOGOUT' })
        }
    }

    const login = async (email: string, password: string) => {
        try {
            dispatch({ type: 'LOADING' })

            const res = await api.post('/api/users/login', {
                email: email,
                password: password,
            })

            toast.success('Đăng nhập thành công.')
            dispatch({ type: 'LOGIN', payload: res.data.user })

        }
        catch (err: any) {
            console.error(err)
            dispatch({ type: 'LOGOUT' })
        }
    }

    const logout = async () => {
        try {
            await api.post('/api/users/logout')
            toast.success('Hẹn gặp lại.')
            dispatch({ type: 'LOGOUT' })
        }
        catch (err: any) {
            console.error(err.response?.data || err.message)
        }
    }

     return { user, loading, signup, login, logout }
}
