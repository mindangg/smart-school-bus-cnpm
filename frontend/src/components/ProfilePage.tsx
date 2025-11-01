"use client"

import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'

const ProfilePage = ({user}: any) => {
    return (
        <main className='w-[90%] max-w-2xl flex flex-col justify-center gap-5
        mx-auto border border-gray-200 p-7 rounded-lg shadow-md mt-5'>
            <h1 className='text-2xl font-bold text-center'>Thông tin</h1>
            <div className='flex flex-col justify-center gap-2'>
                <Label>Họ tên</Label>
                <Input value={user.full_name} readOnly/>
            </div>
            <div className='flex flex-col justify-center gap-2'>
                <Label>Email</Label>
                <Input value={user.email} readOnly/>
            </div>
            <div className='flex flex-col justify-center gap-2'>
                <Label>Số điện thoại</Label>
                <Input value={user.phone_number} readOnly/>
            </div>
            <div className='flex flex-col justify-center gap-2'>
                <Label>Địa chỉ</Label>
                <Input value={user.address} readOnly/>
            </div>
            <div className='flex flex-col justify-center gap-2'>
                <Label>Vai trò</Label>
                <Input value={user.role === 'PARENT' ? 'Phụ huynh' :
                            user.role === 'DRIVER' ? 'Tài xế' :
                            user.role === 'ADMIN' ? 'Quản lý' : ''}
                       readOnly />
            </div>
        </main>
    );
};

export default ProfilePage;