'use client'

import api from '@/lib/axios'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Loader2, RefreshCcw } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import StudentForm from '@/components/user/StudentForm'
import StudentCard from '@/components/user/StudentCard'
import { toast } from 'sonner'

const page = () => {
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [open, setOpen] = useState(false)

    const fetchStudents = async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await api.get('/api/students')
            setStudents(res.data)
        } 
        catch (err: any) {
            console.error('Server error:', err)
            setError("Không thể tải danh sách học sinh.")
        }
        finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        fetchStudents()
    }, [])

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/api/students/${id}`)
            toast('Xóa thành công')
            fetchStudents()
        } catch (err) {
            console.error(err)
            toast('Xóa thành công')
        }
    }
    return (
        <main>
            <section className="m-5">
                <div className="flex gap-5">
                    <h1 className='text-2xl font-bold'>Danh sách học sinh</h1>

                <Button
                    variant="outline"
                    onClick={fetchStudents}
                    disabled={loading}
                    className="flex items-center gap-2"
                >
                    Làm Mới
                    <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
                
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button >
                            Thêm Học Sinh
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                        <DialogTitle>Thêm Tài Xế</DialogTitle>
                        </DialogHeader>
                        <StudentForm 
                            fetchStudents={fetchStudents}
                        />
                    </DialogContent>
                    </Dialog>
                </div>

                
                {loading && (
                    <div className="flex justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                )}

                
            {!loading && !error && (
                <div className="overflow-x-auto">
                    <div className="min-w-[900px]">
                    <div className="flex flex-col gap-5d">

                    {students?.length > 0 ? (
                        students.map(student => (
                            <StudentCard 
                                key={student.student_id}
                                student={student}
                                handleDelete={handleDelete}
                                fetchStudents={fetchStudents}
                            />
                        ))            
                    ) : (
                        <p className="py-6 text-center text-gray-700">
                            Không có học sinh nào.
                        </p>
                    )}
                    </div>
                </div>
                </div>
            )}
            </section>
        </main>
    )
}

export default page