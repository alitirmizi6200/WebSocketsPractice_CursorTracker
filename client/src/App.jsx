import React, { useState } from 'react'
import Login from './components/Login'
import Home from './pages/Home'; 

const App = () => {
  const [username, setUsername] = useState("") 
  return username ? (
    <Home username={username} />
  ) : (
      <Login onSubmit={setUsername}/>
  )
}

export default App
