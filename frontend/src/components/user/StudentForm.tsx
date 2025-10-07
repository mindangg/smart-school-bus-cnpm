'use client'
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import api from '@/lib/axios'
import { useEffect } from "react"

const schema = z.object({
    full_name: z.string().min(1, {
        message: "Vui lòng nhập họ tên.",
    }),
})

type StudentFormProps = {
    student?: {
        full_name: string
        student_id?: number
    }
    mode?: 'create' | 'update'
    fetchStudents: () => void
}

const StudentForm = ({ student, mode = 'create', fetchStudents }: StudentFormProps) => {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: student ?? {
        full_name: "",
        },
    })

    useEffect(() => {
        if (student) 
            form.reset(student)

        else 
            form.reset({
                full_name: "",
            })
    }, [student])

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            if (mode == 'update' && student?.student_id) {
                const payload = { ... values }

                await api.put(`/api/students/${student?.student_id}`, {
                ... values, 
            })
            fetchStudents()
            toast.success('Cập nhật thành công.')
            }
            else {
                await api.post('/api/students', { 
                    ...values
                })
                fetchStudents()
                toast.success('Tạo thành công.')
            }

            form.reset()

        }
        catch (err: any) {
            console.error(err)
            toast.error(mode === 'update' ? 'Cập nhật thất bại.' : 'Tạo thất bại.')
        }
    }

    const { isLoading } = form.formState

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Họ Tên</FormLabel>
                        <FormControl>
                            <Input placeholder="Trần Minh Đăng" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">
                    {isLoading ? 'Đang xử lý...' : mode === 'update' ? 'Cập nhật' : 'Thêm'}
                </Button>
            </form>
        </Form>
    )
}

export default StudentForm