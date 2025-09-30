import type { SignupParentDTO, ParentResponseDTO } from '../dto/ParentDTO'

export const toParent = (dto: SignupParentDTO) => {
    return {
        name: dto.name,
        email: dto.email,
        password: dto.password
    }
}

export const toDTO = (parent: ParentResponseDTO) =>  {
    return {
        name: parent.name,
        email: parent.email
    }
}