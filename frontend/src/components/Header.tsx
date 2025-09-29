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
const Header = () => {
    return (
        <header className='fixed top-0 left-0 flex items-center justify-between w-full h-16 bg-[#E3F1FBFF] shadow-md'>
            <div className='flex items-center'>
                <Image 
                    src='/logo.svg'
                    alt='logo'
                    width={48}
                    height={48}
                />
                <h1 className='text-3xl font-bold italic text-[#0079CEFF]'>BusSGU</h1>
            </div>
            <div className='flex items-center gap-7'>
                <DropdownMenu>
                    <DropdownMenuTrigger className='flex items-center gap-1'>
                        <UserCog />
                        <span className='text-md font-semibold'>Hồ Sơ</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button variant='destructive' className='hover:cursor-pointer'>
                    Đăng xuất
                </Button>
            </div>
        </header>
    )
}

export default Header