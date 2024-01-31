import React, { createContext, useReducer } from 'react'
import { type State, type Action } from './types'
import { reducer, initialState } from './reducer'

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState
])

export function StateProvider ({ children }: { children: React.ReactNode }): React.ReactNode {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  )
}

export const useStateValue = (): [State, React.Dispatch<Action>] => React.useContext(StateContext)
