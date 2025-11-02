import React from 'react'
import {createServerApi} from "@/lib/axiosServer";
import ProfilePage from "@/components/ProfilePage";

const page = async () => {
    const api =await createServerApi();
    const res = await api.get("users/current");
    const user = res.data;
    return (
        <ProfilePage user={user} />
    )
}

export default page