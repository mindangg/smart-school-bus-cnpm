// components/driver/StudentPopup.tsx (cập nhật)
'use client'

import React from 'react'
import {X, User, MapPin, Phone, Mail, School, Clock} from 'lucide-react'

interface StudentPopupProps {
    students: any[]
    studentPickup: string
    setOpen: (open: boolean) => void
    isAdminView?: boolean
    stopInfo?: any
}

const AdminStudentPopup = ({ students, studentPickup, setOpen, isAdminView = false, stopInfo }: StudentPopupProps) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">
                            {isAdminView ? 'Quản lý học sinh' : 'Danh sách học sinh'}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 text-blue-100">
                            <MapPin size={16} />
                            <span className="text-sm">
                                {studentPickup}
                                {stopInfo && ` - ${stopInfo.address}`}
                            </span>
                        </div>
                        {isAdminView && stopInfo && (
                            <div className="text-xs text-blue-200 mt-1">
                                Số học sinh: {students.length}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-white hover:text-blue-200 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[60vh]">
                    {students.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <User size={48} className="mx-auto mb-2 text-gray-300" />
                            <p>Không có học sinh nào tại điểm dừng này</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {students.map((student, index) => (
                                <div
                                    key={student.student_id || index}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {student.full_name}
                                                </h3>
                                                <div className="text-sm text-gray-600 mt-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <School size={14} />
                                                        <span>Lớp: {student.grade || 'Chưa có thông tin'}</span>
                                                    </div>
                                                    {student.parent_phone && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone size={14} />
                                                            <span>PH: {student.parent_phone}</span>
                                                        </div>
                                                    )}
                                                    {student.parent_email && (
                                                        <div className="flex items-center gap-2">
                                                            <Mail size={14} />
                                                            <span>{student.parent_email}</span>
                                                        </div>
                                                    )}
                                                    {isAdminView && student.stop_name && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin size={14} />
                                                            <span className="text-blue-600">
                                                                Điểm đón: {student.stop_name}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {isAdminView && (
                                            <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                ID: {student.student_id}
                                            </div>
                                        )}
                                    </div>

                                    {isAdminView && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    <span className="font-medium">Trường:</span>
                                                    <p className="text-gray-600">{student.school || 'Chưa có thông tin'}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Trạng thái:</span>
                                                    <p className={`font-semibold ${
                                                        student.status === 'active' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        {student.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Tổng cộng: <span className="font-semibold">{students.length} học sinh</span>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminStudentPopup