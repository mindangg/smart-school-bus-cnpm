import {createServerApi} from "@/lib/axiosServer";
import PathsPage from "@/components/driver/PathPage";

const page = async () => {
    const api = await createServerApi()
    const res = await api.get('route_assignment/driver')
    const route_assignment = res.data

    return (
        <PathsPage route_assignment={route_assignment}/>
    )
}

export default page