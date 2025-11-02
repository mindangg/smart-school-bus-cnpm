import {createServerApi} from "@/lib/axiosServer";
import PathsPage from "@/components/admin/paths/PathsPage";

const Paths = async () => {
    const api = await createServerApi()
    const res = await api.get('routes')
    const routes = res.data
    const res1 = await api.get('users?role=DRIVER')
    const drivers = res1.data
    console.log(routes)
    return (
        <PathsPage routes={routes} drivers={drivers}/>
    )
}

export default Paths