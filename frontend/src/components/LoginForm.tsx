"use client"
 
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
import { useState } from "react"
import api from "@/lib/axios"
 
const formSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Vui lòng nhập email."})
        .email({ message: "Email không hợp lệ"}), 

    password: z
    .string()    
    .min(1, { message: "Vui lòng nhập mật khẩu." })
})

const LoginForm = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        email: "",
        password: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        setError('')

        try {
            const res = await api.post("/api/users/login", {
                email: values.email,
                password: values.password,
                role: "Parent"
            })
            console.log("Đăng ký thành công:", res.data)
        } 
        catch (err: any) {
            console.error(err)
            setError(err.response?.data?.message || "Có lỗi xảy ra")
        } 
        finally {
            setLoading(false)
        }
    }
    
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input placeholder="••••••••" {...field} type="password"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng nhập"}
        </Button>
      </form>
    </Form>
    )
}

export default LoginForm