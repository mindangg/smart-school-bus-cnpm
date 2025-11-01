'use client'

import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import api from '@/lib/axios'
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export const useAuthAction = () => {
    const { user, loading, dispatch } = useContext(AuthContext)
    const router = useRouter()
    
    const signup = async (email: string, password: string) => {
        try {
            dispatch({ type: 'LOADING', payload: true })

            const res = await api.post('users/signup', {
                email: email,
                password: password,
                role: 'Parent'
            })

            toast.success('Đăng ký thành công.')
            dispatch({ type: 'LOGIN', payload: res.data.user })
                

        }
        catch (err: any) {
            const msg = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
            toast.error(msg)
        }
        finally {
            dispatch({ type: 'LOADING', payload: false })
        }
    }

    const login = async (email: string, password: string) => {
        try {
            dispatch({ type: 'LOADING' })

            const res = await api.post('users/login', {
                email: email,
                password: password,
            })

            toast.success('Đăng nhập thành công.')
            dispatch({ type: 'LOGIN', payload: res.data.user })

        }
        catch (err: any) {
            const msg = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
            toast.error(msg)
        }
        finally {
            dispatch({ type: 'LOADING', payload: false })
        }
    }

    const logout = async () => {
        try {
            await api.post('users/logout')
            toast.success('Hẹn gặp lại.')
            dispatch({ type: 'LOGOUT' })
            router.replace('/')
        }
        catch (err: any) {
            console.error(err.response?.data || err.message)
        }
    }

     return { user, loading, signup, login, logout }
}
