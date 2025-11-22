import Link from 'next/link'
import {Plus, Trash2} from 'lucide-react'
import {createServerApi} from "@/lib/axiosServer"
import DeleteButton from "@/components/admin/buses/DeleteButton";

const BusesPage = async () => {
    const api = await createServerApi()
    let buses = []

    try {
        const res = await api.get("buses")
        buses = res.data || []
    } catch (error) {
        console.error("Error fetching buses:", error)
    }

    console.log(buses)

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Danh sách xe buýt</h1>
                </div>

                <Link
                    href="/admin/buses/add"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                    <Plus size={20}/>
                    Thêm xe buýt
                </Link>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Số hiệu xe
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Model
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sức chứa
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {buses.length > 0 ? buses.map((bus) => (
                            <tr key={bus.bus_id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {bus.bus_number}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{bus.model || 'Chưa cập nhật'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        <span className="font-medium">{bus.capacity}</span> ghế
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={bus.status}/>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <DeleteButton busId={bus.bus_id}/>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <p className="text-lg font-medium mb-2">Chưa có xe buýt nào</p>
                                        <p className="text-sm mb-4">Hãy thêm xe buýt đầu tiên vào hệ thống</p>
                                        <Link
                                            href="/admin/buses/add"
                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                        >
                                            <Plus size={20}/>
                                            Thêm xe buýt
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const StatusBadge = ({status}) => {
    const statusConfig = {
        true: {
            label: 'Đang hoạt động',
            color: 'bg-green-100 text-green-800'
        },
        false: {
            label: 'Ngừng hoạt động',
            color: 'bg-red-100 text-red-800'
        }
    }

    const config = statusConfig[status] || statusConfig.true

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <span className="w-2 h-2 bg-current rounded-full mr-2"></span>
            {config.label}
        </span>
    )
}

export default BusesPage