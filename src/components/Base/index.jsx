// tools
import React from "react"

// styles img
import styles from "./styles.sass"

export const Button = (props) => {
  return (
    <button
      type={props.type || 'button'}
      className={`${styles.button} ${props.className == 'white' ? styles.white : styles.filled}`}
      style={props.style || {}}
      disabled={props.disabled || props.loading || false}
      onClick={props.onClick}>
      {
        props.loading ? 
        <div className={styles.barsLoader}>
          <span /><span /><span /><span /><span /><span />
        </div>
        : props.children || props.value || props.title
      }
    </button>
  )
}

export const Input = props => {
  return (
    <div className={`${styles.inputBox} ${props.value ? styles.active : ''} ${props.error ? styles.error : ''}`}>
      <input
        type={props.type || 'text'}
        value={props.value || ''}
        min={props.type === 'number' ? 0 : null}
        disabled={props.disabled}
        required={props.required}
        onClick={props.onClick}
        onFocus={props.onFocus}
        onChange={event => props.onChange(event.target.value)}
        onBlur={event => props.onBlur(event.target.value)}
        autoFocus={props.autoFocus}
      />
      <label>{props.label}</label>
    </div>
  )
}

export const InputChecked = (props) => {
  return (
    <div className={styles.InputChecked}>
      <label>
        <input
          type="checkbox"
          checked={props.checked}
          onChange={(event) => props.onChange(event.target.checked)}
        />
        <div>
          {props.checked ?
          <svg width="22" height="22" viewBox="0 0 24 25" fill="none">
            <circle cx="12" cy="12.4922" r="10" fill="none" stroke="var(--Color7)" strokeWidth="2"/>
            <circle cx="12" cy="12.4922" r="7" fill="var(--Color7)"/>
          </svg>
          :
          <svg width="22" height="22" viewBox="0 0 22 23" fill="none">
            <circle cx="11" cy="11.5" r="10" fill="white" stroke="var(--Color7)" strokeWidth="2"/>
          </svg>
          }
          <span> {props.children} </span>
          </div>
      </label>
    </div>
  )
}

export default Button;