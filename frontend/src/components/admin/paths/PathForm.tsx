'use client'

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useEffect, useState} from "react";
import RouteDetailsDisplay from "@/components/admin/paths/RouteDetailDisplay";
import api from "@/lib/axios";
import {toast} from "sonner";

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

const PathForm = ({ routes, drivers, buses }: any) => {
    const [loading, setLoading] = useState(false)
    const [selectedRoute, setSelectedRoute] = useState<any>(null);
    const [selectedDriver, setSelectedDriver] = useState<any>(null);
    const [selectedBus, setSelectedBus] = useState<any>(null);

    routes = routes.filter((item: any) => item.route_type === 'MORNING');

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            routes: "",
            drivers: "",
            buses: "",
        },
    })

    const selectedRouteValue = form.watch("routes");
    const selectedDriverValue = form.watch("drivers");
    const selectedBusValue = form.watch("buses");

    useEffect(() => {
        const route = routes.find((r: any) => String(r.route_id) === selectedRouteValue);
        setSelectedRoute(route || null);
    }, [selectedRouteValue, routes]);

    useEffect(() => {
        const driver = drivers.find((d: any) => String(d.user_id) === selectedDriverValue);
        setSelectedDriver(driver || null);
    }, [selectedDriverValue, drivers]);

    useEffect(() => {
        const bus = buses.find((b: any) => String(b.bus_id) === selectedBusValue);
        setSelectedBus(bus || null);
    }, [selectedBusValue, buses]);

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            const res = await api.post('route_assignment', {
                route_id: Number(values.routes),
                driver_id: Number(values.drivers),
                bus_id: Number(values.buses),
            });

            console.log(res.data);
            toast.success('Phân công tuyến đường thành công!');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            form.reset()
            setSelectedRoute(null);
            setSelectedDriver(null);
            setSelectedBus(null);
        }
        catch (err: any) {
            console.error(err)
        }
    }

    const getRouteLabel = (value: string) => {
        const selected = routes.find((r: any) => String(r.route_id) === value);
        if (!selected) return "";
        return `${selected.route_stops[0].stop.address} | ${selected.route_stops[selected.route_stops.length - 1].stop.address}`;
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex gap-5">
                    <FormField
                        control={form.control}
                        name="routes"
                        render={({ field }) => (
                            <FormItem className='w-1/2'>
                                <FormLabel>Tuyến Đường</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Tuyến Đường">
                                                {field.value ? getRouteLabel(field.value) : "Tuyến Đường"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {routes.map((route: any) => (
                                                <SelectItem key={route.route_id} value={String(route.route_id)}>
                                                    {route.route_stops[0].stop.address} | {route.route_stops[route.route_stops.length - 1].stop.address}
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
                            <FormItem className='w-1/4'>
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
                                            {drivers.map((driver: any) => (
                                                <SelectItem key={driver.email} value={String(driver.user_id)}>
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
                            <FormItem className='w-1/4'>
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
                                            {buses.map((bus: any) => (
                                                <SelectItem key={bus.bus_id} value={String(bus.bus_id)}>
                                                    {bus.bus_number}
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

                <RouteDetailsDisplay
                    selectedRoute={selectedRoute}
                    selectedDriver={selectedDriver}
                    selectedBus={selectedBus}
                />

                <Button type="submit" className='w-full hover:cursor-pointer bg-blue-500 hover:bg-blue-400'>
                    {loading ? 'Đang xử lý...' : 'Phân Công Tuyến'}
                </Button>
            </form>
        </Form>
    );
};

export default PathForm;