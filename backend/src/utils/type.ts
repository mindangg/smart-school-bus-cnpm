export interface Student {
    student_id: number,
    parent_id?: number,
    full_name: string,
    profile_photo_url?: string,
    is_active: boolean,
    created_at: Date,
    stop_id?: number
}