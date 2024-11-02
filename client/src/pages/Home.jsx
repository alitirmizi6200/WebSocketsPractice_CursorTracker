import React, { useEffect, useRef } from 'react'
import useWebSocket from 'react-use-websocket'
import throttle from 'lodash.throttle' // call function no more than specified deline
import { Cursor } from '../components/Cursor'

const Home = ({ username = ""}) => {
    const ws_URL = 'ws://127.0.0.1:8080'
    const { sendJsonMessage, lastJsonMessage } =  useWebSocket(ws_URL, {
        queryParams: { username }
    })

    const trottleLimit = 50; 
    const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, trottleLimit))
    useEffect( ()=> {
      
      window.addEventListener("mousemove", (e) => {
        // send x and y position
        sendJsonMessageThrottled.current({cursor_update: {x: e.clientX, y: e.clientY}})
      })
    }, [])

    const renderCursor = users => {
      return Object.keys(users).map(uuid => {
        const user = users[uuid]; 
        return( 
          <Cursor key={uuid} point={[user.state.x, user.state.y]} name={user.username}/>
        )
      })
    }
    if(lastJsonMessage) {
      return (<>
        {renderCursor(lastJsonMessage)} 
        </>
      )
      
     }
  return (
    <div className='min-h-screen'>
      <h1 className='text-2xl'> Hello, { username }</h1>
    </div>
  )
}

export default Home
