// tools
import React, { useState, useEffect } from "react";
import styles from "./styles.sass";

// components
import MenuOverlay from "@components/MenuOverlay";
import { Input } from '@components/Base'
import ReactCodeInput from "react-code-input";

export const Phone = (props) => {

  function selected(alpha2) {
    const country = props.data.countries.find((country) => country.alpha2 === alpha2)
    if (country) props.setCountry(country)
  }

  return (
    <div className={styles.phone}>
      <MenuOverlay
        labelMenu={'Select country'}
        dropMenuStyle={styles.dropMenuStyle}
        items={props.countries.map((country) => ({ id: country.alpha2, name: country.alpha2, longName: country.name }))}
        selected={(alpha2) => selected(alpha2)}
      >
        <img width={24} height={24} src={require(`@assets/images/images-menu/${props.country?.alpha2.toLowerCase()}.png`).default} alt='Country' />
        <span>{props.country.dialCode}</span>
      </ MenuOverlay>
      <Input
        label='Your phone number'
        type='number'
        error={props.error}
        value={Number(props.number?.split(props.country.dialCode)[1])}
        required={'required'}
        onChange={(value) => props.setNumber(props.country.dialCode + value)}
        onBlur={(value) => props.setNumber(props.country.dialCode + value)}
      />
    </div>
  );
}

export const Email = (props) => {
  return (
    <Input
      label={'Your email'}
      value={props.value}
      error={props.error}
      required={'required'}
      onChange={value => props.validateEmail(value)}
      onBlur={value => props.validateEmail(value)}
    />
  )
}

export const VerifyContact = (props) => {
  const [seconds, setSeconds] = useState(60)

  useEffect(() => { if (seconds > 0) { setTimeout(() => setSeconds(seconds - 1), 1000); } })

  return (
    <div className={styles.PhoneVerification}>
      <h2>Confirm your email address</h2>
      <h3>We’ve sent a confirmation code to {props.contact}<br />The code is valid for 30 minutes. </h3>
      <div className={styles.pinBlock}>
        <ReactCodeInput
          id="pinCode"
          type="number"
          isValid={!props.error}
          fields={6}
          onChange={props.handlePinChange}
          value={props.pinCode}
        />
      </div>
      <div className={styles.taimerBlock}>
        {seconds > 0 ?
          <p>Didn't receive your confirmation code?<br />Get new code in <span> 0:{seconds >= 10 ? '' : '0'}{seconds}</span></p>
          :
          <span className={styles.newCode} onClick={() => {
            setSeconds(60),
              props.getNewCode()
          }}>Get new code</span>
        }
      </div>
    </div>
  );
}

export default Phone;