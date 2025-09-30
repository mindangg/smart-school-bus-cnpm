import SideBar from '@/components/SideBar'
import { driverNav } from "@/lib/navItems"

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex'>
      <SideBar navItems={driverNav} />

      <main className="ml-[16%] w-full h-[100vh] mt-16 flex flex-col gap-6 bg-gray-50 p-6">{children}</main>
    </div>
  )
}