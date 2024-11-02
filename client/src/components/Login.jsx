import React, { useState } from 'react'

const Login = ({onSubmit}) => {
  const [username, setUsername] = useState("")
  return (
    <div className='min-h-screen place-items-center flex justify-center '>
        <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="text-2xl font-bold mb-4">Welcome</h1>
            <h2 className="text-lg mb-2">Your Good Name Sir?...</h2>
            <form 
              className="flex flex-col items-center w-full"
              onSubmit={(e) => {
                e.preventDefault() // prevent to load page refresh
                onSubmit(username);
              }}
            >
              <input
                type="text"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-300 p-2 mb-4 rounded w-full"
              />
              <input
                type="submit"
                value="Submit"
                className="bg-blue-500 text-white p-2 rounded w-full cursor-pointer"
              />
            </form>
        </div>
    </div>
  )
}

export default Login
