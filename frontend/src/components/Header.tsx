'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserCog } from "lucide-react";
import { useAuthAction } from '@/hooks/useAuthAction'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link';
import { useEffect } from 'react';

const Header = () => {
    const { logout } = useAuthAction()
    const { user } = useAuth()

    useEffect(() => {
        console.log(user)
    })

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
            {user ? (
                <div className='flex items-center gap-7'>
                    <DropdownMenu>
                        <DropdownMenuTrigger className='flex items-center gap-1'>
                            <UserCog />
                            <span className='text-md font-semibold'>Hồ Sơ</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>{user?.role}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem>Subscription</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant='destructive' className='hover:cursor-pointer' onClick={logout}>
                        Đăng xuất
                    </Button>
                </div>
            ) : (
                    <Button className='hover:cursor-pointer'>
                        <Link href='/login'>
                            Đăng nhập
                        </Link>
                    </Button>
            )}

        </header>
    )
}

export default Header