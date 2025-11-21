import {createServerApi} from "@/lib/axiosServer";
import PathsPage from "@/components/driver/PathPage";

const page = async () => {
    const api = await createServerApi()
    const res = await api.get('route_assignment/driver')
    const route_assignment = res.data

    const currentRoute = [
        { label: "Mã Xe Buýt", value: route_assignment[0]?.buses?.bus_number},
        {
            label: "Tuyến Đường",
            value: `${route_assignment[0]?.routes.route_stops[0]?.stop.address} → ${route_assignment[0]?.routes.route_stops[1]?.stop.address}`
        },
        {
            label: "Thời Gian Bắt Đầu Dự Kiến",
            value: `${route_assignment[0]?.routes.start_time} Sáng`
        },
        { label: "Thời Gian Kết Thúc Dự Kiến", value: "08:15 AM" }
    ]

    return (
        <PathsPage currentRoute={currentRoute} route_assignment={route_assignment}/>
    )
}

export default page