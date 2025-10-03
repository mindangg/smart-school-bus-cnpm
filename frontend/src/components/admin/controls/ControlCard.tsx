interface ControlCardProps {
    title: string
    icon: React.ReactNode
}

const ControlCards = ({ title, icon } : ControlCardProps) => {
    return (
         <div className="relative group border border-gray-200 shadow-md rounded-lg p-5 flex flex-col gap-2 bg-white cursor-pointer overflow-hidden">
            <div className="flex items-center justify-between">
                <p className="text-md">{title}</p>
                {icon}
            </div>
            <p className="text-4xl font-bold">25</p>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#E3F1FB] to-blue-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>
    )
}

export default ControlCards