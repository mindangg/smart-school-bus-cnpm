export interface SignupParentDTO {
    name: string;
    email: string;
    password: string;
}

export interface LoginParentDTO {
    email: string;
    password: string;
}

export interface ParentResponseDTO {
    id: number;
    name: string;
    email: string;
}
