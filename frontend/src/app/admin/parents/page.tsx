import React from 'react';
import {createServerApi} from "@/lib/axiosServer";
import ParentPage from "@/components/admin/parents/ParentPage";

const Page = async () => {
    const api = await createServerApi()
    const res = await api.get('users?role=PARENT')
    const parents = res.data

    return (
        <ParentPage parents={parents} />
    );
};

export default Page;