import axios from 'axios';
import {cookies} from 'next/headers';

export async function createServerApi() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    return axios.create({
        baseURL: process.env.BACKEND_URL + '/api'  ,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            Cookie: cookieHeader,
        },
    });
}
