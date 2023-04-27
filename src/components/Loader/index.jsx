import React, { useEffect, useState } from "react"
import Logo from '@assets/images/icons/astronaut.svg'
import styles from "./styles.scss"

const Loader = () => {
  const [timeDelay, setTimeDelay] = useState(false)

  useEffect(() => { setTimeout(() => { setTimeDelay(true) }, 10000)}, [])

  return (
    <div className={styles.loader}>
      {timeDelay ?
        <div className={styles.errorBox}>
          <img src={Logo} />
          <h3>Aaaah! Something went wrong</h3>
          <span>Brace yourself till we get the error fixed.<br />You may also refresh the page or try again later.</span>
        </div> :
        <div className={styles.barsLoader}>
          <span /><span /><span /><span /><span /><span />
        </div>
      }
    </div>
  )
}

export default Loader;