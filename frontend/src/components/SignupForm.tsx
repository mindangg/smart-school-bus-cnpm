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
import { useAuthAction } from "@/hooks/useAuthAction";
 
const formSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Vui lòng nhập email."})
        .email({ message: "Email không hợp lệ"}), 

    password: z
      .string()    
      .min(6, { message: "Mật khẩu phải ít nhất 6 ký tự." })
      .regex(/[A-Z]/, { message: "Mật khẩu phải chứa ít nhất 1 ký tự viết hoa." })
      .regex(/[^a-zA-Z0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt." }),

    confPassword: z.string().min(1, { message: "Vui lòng nhập lại mật khẩu." }),
    }).refine((data) => data.password === data.confPassword, {
    path: ["confPassword"],
    message: "Mật khẩu không khớp",
})

const SignupForm = () => {
    const { signup, loading } = useAuthAction()
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        email: "",
        password: "",
        confPassword: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await signup(values.email, values.password)
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

        <FormField
          control={form.control}
          name="confPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhập lại mật khẩu</FormLabel>
              <FormControl>
                <Input placeholder="••••••••" {...field} type="password"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
        </Button>
      </form>
    </Form>
    )
}

export default SignupForm