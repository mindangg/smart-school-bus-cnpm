import SideBar from '@/components/SideBar'
import { adminNav } from "@/lib/navItems"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex'>
      <SideBar navItems={adminNav} />

      <main className="ml-[16%] w-full h-[100vh] mt-16 flex flex-col gap-6 bg-gray-50 p-6">{children}</main>
    </div>
  )
}