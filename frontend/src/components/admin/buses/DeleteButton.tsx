"use client"

import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import api from "@/lib/axios";

export default function DeleteButton({ busId }) {
    const router = useRouter()

    const handleDelete = async () => {
        try {
            await api.delete(`buses/${busId}`)
            router.refresh()
        } catch (error) {
            console.error("Error deleting bus:", error)
        }
    }

    return (
        <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-900 transition-colors duration-200"
        >
            <Trash2 size={18} />
        </button>
    )
}
