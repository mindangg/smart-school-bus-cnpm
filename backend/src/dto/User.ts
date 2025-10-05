export interface userSignupDTO {
    email: string
    password: string
    role: string
}

export interface userLoginDTO {
    email: string
    password: string
}

export interface userCreateDTO {
    email: string
    password: string
    full_name: string
    phone_number: string
    address: string
    role: string
}

export const userGetSelect = {
    user_id: true,
    email: true,
    full_name: true,
    phone_number: true,
    address: true,
    role: true,
} as const