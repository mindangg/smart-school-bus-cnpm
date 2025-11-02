import PathCard from "@/components/admin/paths/PathCard";
import PathForm from "@/components/admin/paths/PathForm";

const PathsPage = ({ routes, drivers } : any) => {
    return (
        <main>
            <section className='bg-white flex flex-col gap-3 mb-10'>
                <h1 className='text-2xl font-bold'>Bảng Phân Công Tuyến Đường</h1>
                <h2 className='text-md font-bold'>Phân Công Tài Xế và Xe Buýt cho Tuyến Đường</h2>
                <PathForm routes={routes} drivers={drivers}/>
            </section>

            <section>
                <h1 className='text-2xl font-bold'>Danh Sách Tuyến Đường</h1>
                <div className="min-w-[900px]">
                    <div className='grid grid-cols-[1.5fr_5fr_1.5fr_1.5fr_1.5fr] py-6 text-center text-black border-b border-gray-300 font-bold'>
                        <span>ID Tuyến Đường</span>
                        <span>Tuyến Đường</span>
                        <span>Khời Hành</span>
                        <span>Thời Gian</span>
                        <span>Hành Động</span>
                    </div>
                    {routes.map((route: any) => (
                        <PathCard key={route.route_id} route={route} />
                    ))}
                </div>
            </section>
        </main>
    );
};

export default PathsPage;