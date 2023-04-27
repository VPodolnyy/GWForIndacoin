import React from "react"
import styles from "./styles.sass"

export const Modal = props => {
  return (
    <div className={styles.modalBack} onClick={() => props.setToggleModal()}>
      <div className={`${styles.modal} ${props.style || ''}`}>
        { props.children }
      </div>
    </div>
  )
}


export default Modal