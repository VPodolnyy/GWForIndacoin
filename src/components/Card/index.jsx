import React, { useState } from 'react'

// components
import { Input } from '@components/Base'

export const CardNumber = (props) => {
  const [cardValue, setCardValue] = useState(null)
  const [cardError, setCardError] = useState(false)

  function validateCardNumber(cardNumber) {
    if (!cardNumber) {
      props.setCard(null)
      return setCardValue(null)
    }
    cardNumber = cardNumber.replace(/[^\d;]/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)
    setCardValue(cardNumber)
    cardNumber = cardNumber.replace(/ /g, '')
    const regex = new RegExp("^[0-9]{16}$");
    if (!regex.test(cardNumber) && cardNumber !== '') return setCardError(true)
    return luhnCheck(cardNumber)
  }

  function luhnCheck(val) {
    var sum = 0;
    for (var i = 0; i < val.length; i++) {
      var intVal = parseInt(val.substr(i, 1));
      if (i % 2 == 0) {
        intVal *= 2;
        if (intVal > 9) { intVal = 1 + (intVal % 10) }
      }
      sum += intVal;
    }
    if ((sum % 10) !== 0) {
      setCardError(true)
      props.setCard(null)
    } else {
      setCardError(false)
      props.setCard(val)
    }
  }
  return (
    <>
      <Input
        label={'Card number'}
        required={'required'}
        error={cardError}
        value={cardValue}
        onChange={value => validateCardNumber(value)}
        onBlur={value => validateCardNumber(value)}
      />
    </>
  );
}

export const CardValidThtu = (props) => {
  const [cardDate, setCardDate] = useState(null)
  const [errorCardDate, setErrorCardDate] = useState(null)

  function validateCardDay(date) {
    if (!date) {
      setCardDate(null)
      return props.setDateCard(null)
    }
    props.setDateCard(null)
    setErrorCardDate(false)
    setCardDate(date.replace(/[^\d;]/g, '').replace(/(.{2})(.{1})/, '$1/$2').trim().slice(0, 5))
    if (date.length === 5) {
      const month = Number(date[0] + date[1])
      const year = Number('20' + date[3] + date[4])
      const today = new Date()
      const enteredDay = new Date()
      const lastDay = new Date()

      enteredDay.setFullYear(year, month, 1)
      lastDay.setFullYear((today.getFullYear() + 10), today.getMonth() + 1, today.getDate())

      if (month > 12) {
        props.setError('The specified month cannot be more than 12')
        return setErrorCardDate(true)
      } else if (enteredDay < today) {
        props.setError('The expiry date is before today date. Please select a valid expiry date')
        return setErrorCardDate(true)
      } else if (enteredDay > lastDay) {
        props.setError('The expiration date of the card cannot be more than 10 years from the current card')
        return setErrorCardDate(true)
      } else return props.setDateCard(date)
    }
  }
  return (
    <>
      <Input
        label={'MM/YY'}
        type={'text'}
        required={'required'}
        error={errorCardDate}
        value={cardDate}
        onChange={(date) => validateCardDay(date)}
        onBlur={(date) => validateCardDay(date)}
      />
    </>
  )
}

export const CardCvc = (props) => {

  const [cvc, setCvc] = useState(null)
  const [errorCvc, setErrorCvc] = useState(null)

  function validateCvc(code) {
    code = code.replace( /[^0-9]/g, '')
    if (code.length > 3) return
    props.setCvcCard(null)
    setCvc(code)
    if (code.length === 3) {
      props.setCvcCard(code)
      setErrorCvc(false)
    } else { setErrorCvc(true) }
  }

  return (
    <>
      <Input
        label={'CVC'}
        type={'text'}
        required={'required'}
        error={errorCvc}
        value={cvc}
        onChange={code => validateCvc(code)}
        onBlur={code => validateCvc(code)}
      />
    </>
  )
}

export default CardNumber
