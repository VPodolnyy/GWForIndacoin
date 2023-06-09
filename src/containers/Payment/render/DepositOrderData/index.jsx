import React, { useState, useEffect } from 'react'
import styles from "./styles.sass"

// components
import YouPay from "@components/Order/YouPay"

const DepositOrderData = props => {

  const [selectedYouGive, setSelectedYouGive] = useState(props.data.currencyIn?.shortName || props.data.currencyes.fiat[0].shortName || 'USD')
  const [amountGive, setAmountGive] = useState(100)

  useEffect(() => { props.submitButton({disabled: false}) }, [])

  useEffect(() => {
    if (props.submit) {
      props.setSubmit(false)
      if (props.data.status === 'New') return props.setStep(2)
      else props.setStep(4)
    }
  }, [props.submit])

  // Инициализация компонента, проверка на наличие в GlobalData
  useEffect(() => { if (props.data.status) return getGlobalParams() })

  function getGlobalParams() {
    if (props.data.currencyIn.shortName) setSelectedYouGive(props.data.currencyIn.shortName)
    if (props.data.amountIn) setAmountGive(props.data.amountIn)
  }

  return (
    <div className={styles.orderData}>
      <div className={styles.orderData__currencyes}>
        <YouPay
          styles={'currencyes'}
          currency={selectedYouGive}
          items={props.data.currencyes.fiat.map((curr) => ({ id: curr.id, name: curr.shortName }))}
          amount={amountGive}
          disabled={true}
          disabledInput={true}
        />
      </div>
      <div className={styles.orderData__infoYouPay}>
        <span><b>{amountGive} {selectedYouGive}</b> is all you pay, all fees included</span>
        <p className={styles.hint}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 15C3.35775 15 0 11.6422 0 7.5C0 3.35775 3.35775 0 7.5 0C11.6422 0 15 3.35775 15 7.5C15 11.6422 11.6422 15 7.5 15ZM7.5 13.5C9.0913 13.5 10.6174 12.8679 11.7426 11.7426C12.8679 10.6174 13.5 9.0913 13.5 7.5C13.5 5.9087 12.8679 4.38258 11.7426 3.25736C10.6174 2.13214 9.0913 1.5 7.5 1.5C5.9087 1.5 4.38258 2.13214 3.25736 3.25736C2.13214 4.38258 1.5 5.9087 1.5 7.5C1.5 9.0913 2.13214 10.6174 3.25736 11.7426C4.38258 12.8679 5.9087 13.5 7.5 13.5ZM6.75 9.75H8.25V11.25H6.75V9.75ZM8.25 8.51625V9H6.75V7.875C6.75 7.67609 6.82902 7.48532 6.96967 7.34467C7.11032 7.20402 7.30109 7.125 7.5 7.125C7.71306 7.12499 7.92173 7.06447 8.10174 6.9505C8.28175 6.83652 8.4257 6.67377 8.51683 6.48119C8.60796 6.2886 8.64252 6.0741 8.61651 5.86263C8.59049 5.65117 8.50496 5.45144 8.36987 5.28668C8.23478 5.12193 8.05568 4.99892 7.85341 4.93198C7.65115 4.86503 7.43403 4.8569 7.22732 4.90853C7.02061 4.96016 6.83281 5.06942 6.68577 5.22361C6.53874 5.3778 6.43851 5.57057 6.39675 5.7795L4.92525 5.48475C5.01647 5.02881 5.22713 4.60528 5.53569 4.25744C5.84425 3.9096 6.23964 3.64994 6.68144 3.50499C7.12324 3.36004 7.59561 3.33501 8.05026 3.43246C8.50491 3.52991 8.92552 3.74633 9.26911 4.05962C9.6127 4.3729 9.86694 4.7718 10.0058 5.21555C10.1447 5.65929 10.1633 6.13196 10.0596 6.58523C9.95599 7.0385 9.73384 7.45612 9.41589 7.7954C9.09794 8.13467 8.6956 8.38343 8.25 8.51625Z" fill="var(--InfoYouPay-Text)"/>
          </svg>
          <span>
            Why are fees necessary?<br /><br />
            To process your payment, we need to pay bank and payment gateway fees, as well as cover legal expenses and maintenance costs.
          </span>
        </p>
      </div>
    </div>
  )
}

export default DepositOrderData
