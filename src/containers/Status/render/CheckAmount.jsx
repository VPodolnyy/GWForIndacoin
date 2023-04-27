import React, { useState, useEffect } from 'react'

import styles from "../styles.scss"
import { Button } from "@components/Base"
import requests from "@requests/request"

function CheckAmount(props) {
  const [renderCash, setRenderCash] = useState(false)
  const [newValue, setNewValue] = useState(true)
  const { amountOutDisplayed, amountIn, currencyIn, currencyOut } = props.data
  const [toggleModal, setToggleModal] = useState(false)

  useEffect(() => { CheckValue() }, [])

  function CheckValue() {
    let network = null
    console.log(props)
    if (!props.data.network) network = props.data.currencyes.crypto.find(crypto => crypto.id === currencyOut.id).networks[0]
    else network = props.data.network
    requests.Calculator(currencyIn.id, currencyOut.id, amountIn, network.id, null).then((amountOut) => {
      if (amountOutDisplayed > amountOut) {
        const percentAmount = (amountOutDisplayed / 100) * (amountOutDisplayed - amountOut)
        if (percentAmount > 10) setNewValue(amountOut), setRenderCash(true), props.setNeedUpdateStatus(true)
        else confirmExchange(amountOut)
      } else confirmExchange(amountOut)
    })
  }

  function cancelExchange() {
    requests.CancelExchange(props.data.id, props.data.hash).then(() => {
      sessionStorage.clear()
      location.reload()
    })
  }

  function confirmExchange(AmountOut) {
    requests.ConfirmExchange(props.data.id, props.data.hash, { amountOutDisplayed: AmountOut }).then(() => {
      props.renewData()
      setRenderCash(false)
      props.data.setStep(8)
    })
  }

  return (
    <>
      {renderCash ?
        <div className={styles.wrapperCheckAmount}>
          <img src={require(`@images/icons/priceChange.png`).default} />
          <div className={styles.priceChangeText}>
            <p>The amount of your order have changed from <b>{amountOutDisplayed} {currencyOut.shortName}</b> to <b>{newValue} {currencyOut.shortName}</b> due to price change. <span>How?</span></p>
          </div>
          <div className={styles.buttonBlock}>
            <Button
              type={'button'}
              className={'text'}
              onClick={() => cancelExchange()}>
              <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                <path d="M0.999999 7L0.292892 6.29289C0.105355 6.48043 -1.39974e-06 6.73478 -1.34048e-06 7C-1.28123e-06 7.26522 0.105356 7.51957 0.292892 7.70711L0.999999 7ZM7.70711 1.70711C8.09763 1.31658 8.09763 0.683418 7.70711 0.292893C7.31658 -0.0976319 6.68342 -0.0976317 6.29289 0.292893L7.70711 1.70711ZM6.2929 13.7071C6.68342 14.0976 7.31659 14.0976 7.70711 13.7071C8.09763 13.3166 8.09763 12.6834 7.70711 12.2929L6.2929 13.7071ZM1.70711 7.70711L7.70711 1.70711L6.29289 0.292893L0.292892 6.29289L1.70711 7.70711ZM7.70711 12.2929L1.70711 6.29289L0.292892 7.70711L6.2929 13.7071L7.70711 12.2929Z" fill="var(--Color7)" />
              </svg> Back
            </Button>
            <Button type={'button'} onClick={() => confirmExchange(newValue)}>Accept and continue</Button>
          </div>

          {toggleModal &&
            <Modal setToggleModal={() => setToggleModal(false)} >
              <span style={{ fontSize: '18px' }}>Are you sure you want to cancel the transaction?</span>
              <div className={styles.buttonBlock}>
                <Button className={'text'} title={'NO'} />
                <Button onClick={() => cancelRequest()} title={'YES'} />
              </div>
            </Modal>
          }
        </div>
        :
        <div className={styles.barsLoader}>
          <span /><span /><span /><span /><span /><span />
        </div>
      }
    </>
  );
}

export default CheckAmount