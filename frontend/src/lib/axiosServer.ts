import axios from 'axios';
import {cookies} from 'next/headers';

export async function createServerApi() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            Cookie: cookieHeader,
        },
    });
}
