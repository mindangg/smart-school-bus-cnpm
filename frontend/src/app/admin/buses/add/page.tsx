'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {Save} from 'lucide-react'
import Link from 'next/link'
import {Button} from "@/components/ui/button";
import api from "@/lib/axios";

const AddBusPage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const [formData, setFormData] = useState({
        bus_number: '',
        capacity: '',
        model: '',
        status: 'true'
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const response = await api.post('buses', {
                bus_number: formData.bus_number,
                capacity: parseInt(formData.capacity, 10),
                model: formData.model,
                status: formData.status
            })

            const result = await response.data

            if (response.status === 201) {
                setMessage('Thêm xe buýt thành công!')
                setFormData({
                    bus_number: '',
                    capacity: '',
                    model: '',
                    status: 'true'
                })
                router.push('/admin/buses')
            } else {
                setMessage(result.error || 'Có lỗi xảy ra khi thêm xe buýt!')
            }
        } catch (error) {
            setMessage('Lỗi kết nối! Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Thêm xe buýt mới</h1>
                    <p className="text-gray-600 mt-2">Thêm thông tin xe buýt mới vào hệ thống</p>
                </div>
                <Link
                    href="/admin/buses"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                    <Button
                        variant="outline"
                    >
                        Quay lại
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                {message && (
                    <div className={`p-4 rounded-lg mb-6 ${
                        message.includes('thành công')
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="bus_number" className="block text-sm font-medium text-gray-700 mb-2">
                                Số hiệu xe *
                            </label>
                            <input
                                type="text"
                                id="bus_number"
                                name="bus_number"
                                value={formData.bus_number}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="VD: SGU-001"
                            />
                        </div>

                        <div>
                            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                                Sức chứa *
                            </label>
                            <input
                                type="number"
                                id="capacity"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="VD: 45"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                                Model xe
                            </label>
                            <input
                                type="text"
                                id="model"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="VD: Hyundai County, Toyota Coaster..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                        <Link
                            href="/admin/buses"
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={20} />
                            {loading ? 'Đang thêm...' : 'Thêm xe buýt'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddBusPage