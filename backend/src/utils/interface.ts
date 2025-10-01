export interface User {
    user_id: string
    email: string
    password: string
    full_name?: string
    phone_number?: string
    address?: string
    role: string
    is_active: boolean
    created_at: Date
    updated_at: Date
}

export interface BusStop {
    latitude?: number
    longitude?: number
    address?: string
    is_active: boolean

    students?: Student[]
}

export interface Bus {
    bus_number: string
    license_plate: string
    capacity?: number
    model?: string
    year?: number
    status?: string
    last_maintenance_date?: Date

    route_assignments?: RouteAssignment[]
    routes?: Route[]
}

export interface Notification {
    user_id: number
    notification_type?: string
    title: string
    message?: string
    event_id?: number
    is_read: boolean
    created_at: Date

    user?: User
    student_event?: StudentEvent
}

export interface RouteAssignment {
    route_id: number
    driver_id: number
    bus_id: number
    assignment_date: Date
    is_active: boolean
    created_at: Date

    route?: Route
    user?: User
    bus?: Bus
    student_events?: StudentEvent[]
}

export interface Route {
    route_type?: string
    bus_id?: number
    start_time?: Date
    is_active: boolean
    created_at: Date
    updated_at: Date

    route_assignments?: RouteAssignment[]
    bus?: Bus
}

export interface StudentEvent {
    student_id: number
    route_assignment_id?: number
    event_type: string
    event_time: Date
    notes?: string

    notifications?: Notification[]
    student?: Student
    route_assignment?: RouteAssignment
}

export interface Student {
    parent_id?: number
    full_name: string
    profile_photo_url?: string
    is_active: boolean
    created_at: Date
    stop_id?: number

    student_events?: StudentEvent[]
    user?: User
    bus_stop?: BusStop
}

export interface User {
    email: string
    password: string
    full_name?: string
    phone_number?: string
    address?: string
    role: string
    is_active: boolean
    created_at: Date
    updated_at: Date

    notifications?: Notification[]
    route_assignments?: RouteAssignment[]
    students?: Student[]
}
