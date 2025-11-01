import StudentForm from '@/components/user/StudentForm'
import {createServerApi} from "@/lib/axiosServer";

const page = async () => {
    const api = await createServerApi()
    const res = await api.get("/students/parent")
    const students = res.data

    return (
        <main>
            <section className="m-5">
                <h1 className='text-2xl font-bold'>Danh sách học sinh</h1>
                <div className="flex flex-col gap-7">
                    {students?.length > 0 ? (
                        students.map((student: any) => (
                            <StudentForm
                                key={student.student_id}
                                student={student}
                            />
                        ))
                    ) : (
                        <p className="py-6 text-center text-gray-700">
                            Không có học sinh nào.
                        </p>
                    )}
                </div>
            </section>
        </main>
    )
}

export default page