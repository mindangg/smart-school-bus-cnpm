'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as Icons from 'lucide-react'

interface NavItem {
    label: string
    href: string
    icon: string
}
interface SideBarProps {
    navItems: NavItem[]
}

const SideBar = ({ navItems } : SideBarProps) => {
    const pathname = usePathname()

    return (
        <nav className='fixed top-16 left-0 flex flex-col gap-3 w-[16%] h-full p-2 pt-4 pr-1 border-r border-gray-200 shadow-md z-10'>
            {navItems.map(({ label, href, icon }) => {
                const Icon = (Icons as any)[icon]
                return (
                <Link   
                    href={href} 
                    key={label}
                    className={cn(
                            'flex items-center gap-1 text-gray-500 hover:bg-gray-200 p-3 rounded-sm',
                            pathname === href && 'text-black font-semibold bg-gray-200'
                        )}
                    >
                    {Icon ? <Icon className="w-5 h-5" /> : null}
                    <span className='text-sm'>{label}</span>
                </Link>
                )   
            })}
        </nav>
    )
}

export default SideBar