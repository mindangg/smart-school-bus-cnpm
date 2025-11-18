'use client'

import React, {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import api from "@/lib/axios";
import {toast} from "sonner";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const schema = z.object({
    parent_id: z
        .number({
            message: "Vui lòng chọn phụ huynh.",
        }),

    profile_photo_file: z
        .any()
        .refine((files) => !files || files.length === 1, "Vui lòng chọn ảnh dại diện.")
        .optional(),
    profile_photo_url: z.string().optional(),

    full_name: z.string().min(1, {
        message: "Vui lòng nhập họ tên.",
    }),
})

const StudentForm = ({ student, mode = 'create' } : any) => {
    const router = useRouter()
    const [parents, setParents] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(student?.profile_photo_url || null)

    useEffect(() => {
        const fetchParents = async () => {
            try {
                const res = await api.get('users?role=PARENT')
                setParents(res.data)
                console.log(res.data)
            }
            catch (err: any) {
                console.log(err)
            }
        }

        fetchParents()
    }, []);

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: student ?? {
            parent_id: undefined,
            profile_photo_url: "",
            full_name: "",
        },
    })

    useEffect(() => {
        if (student)
            form.reset(student)

        else
            form.reset({
                parent_id: undefined,
                profile_photo_url: "",
                full_name: "",
            })
    }, [student])

    const uploadToCloudinary = async (file: File) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "mindang-upload")
        const res = await fetch("https://api.cloudinary.com/v1_1/dunovasag/image/upload", {
            method: "POST",
            body: formData,
        })
        const data = await res.json()
        return data.secure_url
    }

    const onSubmit = async (values: z.infer<typeof schema>) => {
        console.log(values)
        try {
            setIsLoading(true)

            const payload: any = { ...values }

            if ("profile_photo_file" in values && values.profile_photo_file?.[0]) {
                payload.profile_photo_url = await uploadToCloudinary(values.profile_photo_file[0])
            }

            delete payload.profile_photo_file

            if (mode == 'update' && student?.student_id) {
                await api.put(`students/${student?.student_id}`, payload)
                router.refresh()
                toast.success('Cập nhật thành công.')
            }
            else {
                await api.post('students', payload )
                router.refresh()
                toast.success('Tạo thành công.')
            }

            form.reset()
        }

        catch (err: any) {
            console.error(err)

            const msg =
                err.response?.data?.message ||
                (mode === 'create'
                    ? 'Thêm thất bại. Vui lòng thử lại.'
                    : 'Cập nhật thất bại. Vui lòng thử lại.')

            toast.error(msg)
        }
        finally{
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="parent_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phụ Huynh</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value?.toString()}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Phụ huynh" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {parents?.map((parent: any) => (
                                            <SelectItem
                                                key={parent.user_id}
                                                value={parent.user_id.toString()}
                                            >
                                                {parent.full_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="profile_photo_file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ảnh Đại Diện</FormLabel>
                            <FormControl>
                                <Input
                                    type='file'
                                    accept="image/*"
                                    onChange={(e) => {
                                        const files = e.target.files
                                        field.onChange(files)
                                        if (files && files[0]) {
                                            setAvatarPreview(URL.createObjectURL(files[0]))
                                        }
                                    }}
                                />
                            </FormControl>
                            {avatarPreview && (
                                <img
                                    src={avatarPreview}
                                    alt="Ảnh Đại Diện"
                                    width={200}
                                    height={200}
                                    className="mt-2 object-cover rounded"
                                />
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
    );
};

export default StudentForm;