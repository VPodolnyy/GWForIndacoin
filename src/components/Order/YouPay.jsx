import React from 'react'
import styles from "./styles.sass"
// components
import MenuOverlay from "@components/MenuOverlay"

const YouPay = (props) => {

  function setValue (value) {
    value = value.replace(/[^0-9,.]/g, '').slice(0, 7)
    props.setAmountGive(value)
  }

  return (
    <div className={`${styles.paymentInput} ${props.error ? styles.error : ''}`}>
      <div className={`${styles.inputBox} ${props.amount ? styles.active : ''} ${props.error ? styles.error : ''}`}>
        <input
          type={'number'}
          value={props.amount}
          min={0}
          max={6000}
          disabled={props.disabledInput}
          required={'required'}
          onClick={props.onClick}
          onFocus={props.onFocus}
          onChange={event => setValue(event.target.value)}
          onPaste={event => setValue(event.target.value)}
          onBlur={event => setValue(event.target.value)}
        />
        <label>YOU PAY</label>
      </div>
      <MenuOverlay
        labelMenu={'Select fiat currency'}
        items={props.items}
        selected={(selected) => props.selectedGive(selected)}
        value={props.currency}
        disabled={props.disabled || (props.items.length === 1)}
      />
    </div>
  );
}

export default YouPay;
