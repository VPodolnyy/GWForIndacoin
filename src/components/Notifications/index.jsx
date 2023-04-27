import React, { useState, useEffect } from 'react'
import styles from './styles.sass'

const Notifications = (props) => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    setInterval(() => {
      if (messages.length) {
        const time = new Date().getTime()
        const indexDelMessage = messages.findIndex(mess => (mess.time < (time - 10000) && !mess.flag))
        if (indexDelMessage >= 0) delMessage(indexDelMessage)
      }
    }, 1000);
  }, [])

  useEffect(() => {
    if (typeof props.text === 'string') {
      messages.push({text: props.text, time: messageTime(), flag: false})
      props.clearMessage(null)
    }
  }, [props.text])

  function changeFlag (key) {
    if (messages[key].flag) messages[key].time = messageTime()
    messages[key].flag = !messages[key].flag
  }

  const messageTime = () => {
    const date = new Date
    return date.getTime()
  }

  function delMessage (key) {
    messages.splice(key, 1)
    setMessages([...messages])
  }

  return (
    <div className={styles.messageBox}>
      {
        messages.map((message, key) => {
          return (
            <span
              className={`${styles.message} ${props.type === 'info' ? styles.info : styles.error}`}
              key={message.text + key}
              onPointerEnter={() => changeFlag(key)}
              onPointerLeave={() => changeFlag(key)}>
              {message.text}
              <svg onClick={() => delMessage(key)} width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="12" fill="#FF5A5A"/>
                <path d="M12.1441 10.8853L14.9729 8.05658L16.2317 9.31538L13.4029 12.1441L16.26 15.0012L15.0012 16.26L12.1441 13.4029L9.32245 16.2246L8.06365 14.9658L10.8853 12.1441L8 9.2588L9.2588 8L12.1441 10.8853Z" fill="#FFE0DC"/>
              </svg>
            </span>
          )
        })
      }
    </div>
  )
}

export default Notifications;