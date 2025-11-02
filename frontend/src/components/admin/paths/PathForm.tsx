'use client'

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useState} from "react";

const schema = z.object({
    routes: z.string().min(1, {
        message: "Vui lòng chọn tuyến đường."
    }),

    drivers: z.string().min(1, {
        message: "Vui lòng chọn tài xế.",
    }),

    buses: z.string().min(1, {
        message: "Vui lòng chọn xe buýt.",
    }),
})


const PathForm = ({ routes, drivers }: any) => {
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            routes: "",
            drivers: "",
            buses: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            console.log(values)

            form.reset()

        }
        catch (err: any) {
            console.error(err)

        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex gap-5">
                    <FormField
                        control={form.control}
                        name="routes"
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel>Tuyến Đường</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Tuyến Đường" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {routes.map((route : any) => (
                                                <SelectItem key={route.route_id} value={route.route_id}>
                                                    {route.route_stops[0].stop.address} - {route.route_stops[1].stop.address}
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
                        name="drivers"
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel>Tài Xế</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Tài Xế" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {drivers.map((driver : any) => (
                                                <SelectItem key={driver.email} value={driver.user_id}>
                                                    {driver.full_name}
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
                        name="buses"
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel>Xe Buýt</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Xe Buýt" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {routes.map((route : any) => (
                                                <SelectItem key={route.route_id} value={route.route_id}>
                                                    {route.route_id}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" className='w-full hover:cursor-pointer bg-blue-500 hover:bg-blue-400'>
                    {loading ? 'Đang xử lý...' : 'Phân Công Tuyến'}
                </Button>
            </form>
        </Form>
    );
};

export default PathForm;