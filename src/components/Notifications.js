import React from 'react'
import './messagestyles.css'

const Notification = ({ info }) => {

  if (info === null)
    return null

  let { message, status } = info

  if (status)
    return <div className='valid'>{message}</div>

  return <div className='error'>{message}</div>
}


export default Notification