import React from 'react'
// styles
import styles from "./styles.sass"
// components
import MenuOverlay from "@components/MenuOverlay"

function YouGet(props) {

  const count = n => {
    n = 1 + Math.log10(n*n) / 2
    n = 9 - (Math.max(n - n % 1, 1))
    return n >= 0 ? n : 0
  }

  return (
    <div className={`${styles.paymentInput} ${props.error ? styles.error : ''}`}>
      <div className={`${styles.inputBox} ${styles.active} ${props.error ? styles.error : ''}`}>
        <input
          type={'number'}
          value={props.amount.toFixed(count(props.amount))}
          min={0}
          disabled={true}
          required={'required'}
        />
        <label>YOU GET</label>
      </div>
      <MenuOverlay
        labelMenu={'Select cryptocurrency'}
        items={props.items}
        disabled={(props.items.length === 1)}
        selected={(selected) => props.selectedGive(selected)}
        value={props.currency}
      />
    </div>
  );
}

export default YouGet;
