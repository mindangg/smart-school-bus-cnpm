import React from "react"
import SideBar from "@/components/SideBar"

interface RoleLayoutProps {
  navItems: {
    label: string
    href: string
    icon: string
  }[]
  children: React.ReactNode
}

const RoleLayout = ({ navItems, children }: RoleLayoutProps) => {
  return (
    <div>
      <SideBar navItems={navItems} />

      <main>{children}</main>
    </div>
  )
}

export default RoleLayout
