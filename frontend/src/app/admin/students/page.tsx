import StudentPage from "@/components/admin/students/StudentPage";
import {createServerApi} from "@/lib/axiosServer";

const page = async () => {
    const api = await createServerApi()
    const res = await api.get('students')
    const students = res.data

    return (
        <StudentPage students={students} />
    )
}

export default page