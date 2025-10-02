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
    isOpen?: boolean
    onClose?: () => void
}

const SideBar = ({ navItems, isOpen, onClose }: SideBarProps) => {
    const pathname = usePathname()

    return (
        <nav
        className={cn(
            "fixed top-16 left-0 flex flex-col gap-3 w-[16%] h-full p-2 pt-4 pr-1 border-r border-gray-200 shadow-md z-40 bg-white transition-transform",
            "md:translate-x-0", 
            isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        >
            {navItems.map(({ label, href, icon }) => {
                const Icon = (Icons as any)[icon]
                return (
                <Link   
                    href={href} 
                    key={label}
                    onClick={onClose}
                    className={cn(
                        'flex items-center md:justify-start justify-center text-gray-500 hover:bg-gray-200 p-3 rounded-sm',
                        pathname === href && 'text-black font-semibold bg-gray-200'
                    )}
                    >
                    {Icon ? <Icon className="w-5 h-5 shrink-0" /> : null}
                    <span className="text-sm ml-2 hidden md:inline">{label}</span>
                </Link>
                )   
            })}
        </nav>
    )
}

export default SideBar