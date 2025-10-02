import { createContext, useReducer, useEffect, useContext } from 'react'
import type { Dispatch, ReactNode } from 'react'

type AuthState = {
    user: null | { id: string; email: string };
    loading: boolean;
}

type AuthAction = 
  | { type: 'LOGIN'; payload: { id: string; email: string } }
  | { type: 'LOGOUT' }
  | { type: 'LOADING' }

export const AuthContext = createContext<any>(null)

const initialState: AuthState = { user: null, loading: false }

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch(action.type){
    case 'LOGIN':
        return { 
            ...state, user: action.payload, loading: false
        }
      
    case 'LOGOUT':
        return { 
            ...state, user: null, loading: false
        }
    case 'LOADING':
        return { ...state, loading: true }
      
    default:
      return state
  }
}

type AuthProviderProps = { children: ReactNode }

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
    const [state, dispatch] = useReducer(authReducer, initialState)

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)