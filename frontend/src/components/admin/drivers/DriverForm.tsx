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
import {useRouter} from "next/navigation";

const baseSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Vui lòng nhập email."})
        .email({ message: "Email không hợp lệ"}), 

    full_name: z.string().min(1, {
        message: "Vui lòng nhập họ tên.",
    }),

    phone_number: z
        .string()
        .trim()
        .refine(
            (value) => /^(\+84|0)(3|5|7|8|9)\d{8}$/.test(value),
            { message: "Số điện thoại không hợp lệ." }
        ),

    address: z.string().min(1, {
        message: "Vui lòng nhập địa chỉ.",
    }),
})

// Create
const createSchema = baseSchema.extend({
    password: z
        .string()    
        .min(6, { message: "Mật khẩu phải ít nhất 6 ký tự." })
        // .regex(/[A-Z]/, { message: "Mật khẩu phải chứa ít nhất 1 ký tự viết hoa." })
        .regex(/[^a-zA-Z0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt." })
})

// Update
const updateSchema = baseSchema.extend({
    password: z
        .string()    
        .min(6, { message: "Mật khẩu phải ít nhất 6 ký tự." })
        // .regex(/[A-Z]/, { message: "Mật khẩu phải chứa ít nhất 1 ký tự viết hoa." })
        .regex(/[^a-zA-Z0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt." })
        .optional()
})

type DriverFormProps = {
    driver?: {
        email: string
        full_name: string
        phone_number: string
        address: string
        password?: string
        user_id?: number
    }
    mode?: 'create' | 'update'
}

const DriverForm = ({ driver, mode = 'create' }: DriverFormProps) => {
    const router = useRouter()

    const schema = mode === 'create' ? createSchema : updateSchema
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: driver ?? {
        email: "",
        password: "",
        full_name: "",
        phone_number: "",
        address: ""
        },
    })

    useEffect(() => {
        if (driver) 
            form.reset(driver)

        else 
            form.reset({
                email: "",
                password: "",
                full_name: "",
                phone_number: "",
                address: ""
            })
    }, [driver])

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            if (mode == 'update' && driver?.user_id) {
                const payload = { ... values }
                if (!payload.password) 
                    delete payload.password

                await api.put(`users/${driver?.user_id}`, {
                ... values, 
                role: 'DRIVER'
            })
            router.refresh()
            toast.success('Cập nhật thành công.')
            }
            else {
                await api.post('users/signup', {
                    ...values, role: 'DRIVER'
                })
                router.refresh()
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="smartschoolbus@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                {mode === 'create' ? (
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Mật Khẩu</FormLabel>
                        <FormControl>
                            <Input placeholder="Smartschoolbus1@" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                ) : null}

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

                <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                            <Input placeholder="090-123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                            <Input placeholder="Hồ Chí Minh" {...field} />
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

export default DriverForm