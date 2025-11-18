import {createServerApi} from "@/lib/axiosServer";
import PathsPage from "@/components/admin/paths/PathsPage";

const Paths = async () => {
    const api = await createServerApi()
    const res = await api.get('routes?isAvailable=true')
    const routes = res.data
    const res1 = await api.get('users?role=DRIVER&isAvailable=true')
    const drivers = res1.data
    const res2 = await api.get('buses?isAvailable=true')
    const buses = res2.data

    return (
        <PathsPage routes={routes} drivers={drivers} buses={buses}/>
    )
}

export default Paths