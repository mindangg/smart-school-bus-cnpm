'use client'
import Image from 'next/image'
import {Button} from '@/components/ui/button'
import {useAuthAction} from '@/hooks/useAuthAction'
import {useAuth} from '@/contexts/AuthContext'

const Header = () => {
    const { logout } = useAuthAction()
    const { user } = useAuth()

    return (
        <header className='fixed top-0 left-0 flex items-center justify-between w-full h-16 px-3 bg-[#E3F1FBFF] shadow-md z-20'>
            <div className='flex items-center'>
                <Image 
                    src='/logo.svg'
                    alt='logo'
                    width={48}
                    height={48}
                />
                <h1 className='text-3xl font-bold italic text-[#0079CEFF]'>BusSGU</h1>
            </div>
            {user && (
                <div className='flex items-center gap-1'>
                    <Button variant='destructive' className='hover:cursor-pointer' onClick={logout}>
                        Đăng xuất
                    </Button>
                </div>
            )}
        </header>
    )
}

export default Header