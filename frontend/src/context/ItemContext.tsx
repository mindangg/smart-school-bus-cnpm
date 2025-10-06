import { createContext, useReducer, useContext } from 'react'
import type { ReactNode } from 'react'

type ItemState = {
    items: any[] | null
    loading: boolean
}

type ItemAction = 
  | { type: 'DISPLAY_ITEM'; payload: any[] }
  | { type: 'ADD_ITEM'; payload: any }
  | { type: 'DELETE_ITEM'; payload: any }
  | { type: 'UPDATE_ITEM'; payload: any[] }
  | { type: 'LOADING' }

export const ItemContext = createContext<any>(null)

const initialState: ItemState = { items: null, loading: true }

export const itemReducer = (state: ItemState, action: ItemAction): ItemState => {
  switch(action.type){
    case 'DISPLAY_ITEM':
        return { 
            ...state, items: action.payload, loading: false
        }
      
    case 'ADD_ITEM':
        return { 
            ...state, items: state.items ? [action.payload, ...state.items] : [action.payload] , loading: false
        }
      
    case 'DELETE_ITEM':
        return { 
            ...state, items: state.items ? state.items.filter((m) => m._id !== action.payload) : null, loading: false
        }
      
    case 'UPDATE_ITEM':
        return { 
            ...state, items: action.payload, loading: false
        }

    case 'LOADING':
        return { ...state, loading: true }
      
    default:
      return state
  }
}

type ItemProviderProps = { children: ReactNode }

export const AuthContextProvider = ({ children }: ItemProviderProps) => {
    const [state, dispatch] = useReducer(itemReducer, initialState)

    return (
        <ItemContext.Provider value={{ items: state.items, loading: state.loading, dispatch }}>
            {children}
        </ItemContext.Provider>
    )
}

export const useItem = () => {
    const context = useContext(ItemContext)
    if (!context) 
        throw new Error('useItem must be used within ItemContextProvider')
    return context
}