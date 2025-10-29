import {createServerApi} from "@/lib/axiosServer";
import DriverPage from "@/components/admin/drivers/DriverPage";

const page = async () => {
    const api = await createServerApi()
    const res = await api.get('users?role=DRIVER')
    const drivers = res.data

    return (
        <DriverPage drivers={drivers} />
    )
}

export default page