'use client'

import { useContext, useState } from 'react'
import { AuthContext } from '@/context/AuthContext'
import api from '@/lib/axios'

export const useAuthAction = () => {
    const { state, dispatch } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const login = async (email: string, password: string) => {
        try {
            setLoading(true)
            setError('')

            const res = await api.post('/api/users/current', {
                email: email,
                password: password,
            })
            
            dispatch({ type: 'LOGIN', payload: res.data.user }) 
            console.log('Đăng ký thành công:', res.data)

        } 
        catch (err: any) {
            console.error(err)
            setError(err.response?.data?.message || 'Có lỗi xảy ra')
            dispatch({ type: 'LOGOUT' })
        } 
        finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            await api.post('/api/users/logout')
            dispatch({ type: 'LOGOUT' })
        } 
        catch (err: any) {
            console.error(err.response?.data || err.message)
        }
    }

     return { ...state, login, logout, error, loading }
}
