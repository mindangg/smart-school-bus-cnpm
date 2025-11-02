import React from 'react';
import PathRouteDetails from "@/components/admin/paths/PathRouteDetails";
import {createServerApi} from "@/lib/axiosServer";

const Page = async ({ params } : any) => {
    const { id } = await params
    const api = await createServerApi()
    const res =  await api.get(`routes/${id}`)
    const route = res.data

    return (
        <PathRouteDetails pathRoute={route} />
    )
}

export default Page;