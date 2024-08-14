import React from 'react'
import nochat from '../../assets/noChats.png'
import styles from '../../styles/currentChat.css'

const NoChat = () => {
  return (
    <div className="noChatout">
      <img
        src={nochat}
        width={500}
        height={500}
        alt=''
        className="nochat"
      />
    </div>

  )
}

export default NoChat