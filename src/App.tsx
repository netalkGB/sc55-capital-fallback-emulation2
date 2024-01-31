import './App.css'
import Main from './pages/Main.tsx'
import React from 'react'
import { StateProvider } from './state/stateContext.tsx'

function App (): React.ReactNode {
  return (
    <StateProvider>
      <Main />
    </StateProvider>
  )
}

export default App
