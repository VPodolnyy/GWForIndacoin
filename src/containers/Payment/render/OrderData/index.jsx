import React, { useState, useEffect } from 'react'
import styles from "./styles.sass"
import requests from "@requests/request"

// components
import YouPay from "@components/Order/YouPay"
import YouGet from "@components/Order/YouGet"

const OrderData = (props) => {
  // YouGive
  const [selectedYouGive, setSelectedYouGive] = useState(props.data.currencyIn?.shortName || props.data.currencyes.fiat[0].shortName || 'USD')
  const [amountGive, setAmountGive] = useState(props.data.amountIn || 100)
  const debouncedValue = useDebounce(amountGive, 500)
  const [errorGive, setErrorGive] = useState(null);
  const [priceOneCrypto, setPriceOneCrypto] = useState(null)

  // YouGet
  const [selectedYouGet, setSelectedYouGet] = useState(props.data.currencyOut?.shortName || props.data.currencyes.crypto[0].shortName || 'INTT')
  const [amountGet, setAmountGet] = useState(0)
  const [loadingGet, setloadingGet] = useState(false)

  // Networks
  const [networks, setNetworks] = useState([])
  const [activeNetwork, setActiveNetwork] = useState(null);

  // Общие
  const [partner, setPartner] = useState(null)

  const exchangeRequestId = sessionStorage.getItem('exchangeRequestId')
  const hash = sessionStorage.getItem('hash')

  useEffect(() => { if (props.submit) createRequest() }, [props.submit])

  // Подгрузка списка сетей при смене криптовалюты и установка активной сети
  useEffect(() => {
    setNetworks(props.data.currencyes.crypto.find((curr) => curr.shortName === selectedYouGet).networks)
  }, [selectedYouGet])

  // При изменении списка сетей, устанавливаем первый элемент
  useEffect(() => { setActiveNetwork(networks[0]?.shortName) }, [networks])

  // Запуск конвертера при изменении валют и суммы
  useEffect(() => { if (debouncedValue) Converter() }, [selectedYouGet, selectedYouGive, debouncedValue])

  // Инициализация компонента, проверка на наличие в GlobalData
  useEffect(() => {
    if (props.data.status) return getGlobalParams()
  })

  // Включаем/Выключаем кнопку в зависимости от заполнения данных
  useEffect(() => {
    if (amountGet && amountGet !== 0 && !errorGive) return props.submitButton({disabled: false})
    props.submitButton({disabled: true})
  }, [amountGet])

  // Вывод примерной стоимости 1 единицы
  useEffect(() => {
    if (amountGet && (amountGive / amountGet) != Infinity) {
      return setPriceOneCrypto(`1 ${selectedYouGet} ≈ ${(amountGive / amountGet).toFixed(10)} ${selectedYouGive}`)
    } else setPriceOneCrypto(null)
  }, [amountGet, selectedYouGet, selectedYouGive])

  function getGlobalParams() {
    const { amountIn, amountOutDisplayed, partnerId } = props.data
    if (props.data.currencyIn?.shortName) setSelectedYouGive(props.data.currencyIn.shortName)
    if (props.data.currencyOut?.shortName) setSelectedYouGet(props.data.currencyOut.shortName)
    if (amountIn) setAmountGive(amountIn)
    if (amountOutDisplayed) setAmountGet(amountOutDisplayed)
    if (partnerId) setPartner(partnerId)
  }

  function Converter() {
    setloadingGet(true)
    setErrorGive(null)
    const youGive = props.data.currencyes.fiat.find((curr) => curr.shortName === selectedYouGive)
    const youGet = props.data.currencyes.crypto.find((curr) => curr.shortName === selectedYouGet)
    const network = youGet.networks.find((network) => network?.shortName.toUpperCase() === activeNetwork?.toUpperCase()) || youGet.networks[0]
    requests.Calculator(youGive.id, youGet.id, debouncedValue, network.id, null).then(amount => {
      if (Math.sign(amount) >= 0) setAmountGet(amount)
      else Promise.reject()
    }).catch(error => {
      setAmountGet(0)
      if (error.response.status === 400) setErrorGive(error.response.data)
      else setErrorGive('Internal server Error. Please contact technical support')
    })
    setloadingGet(false)
  }

  function createRequest() {
    props.setSubmit(false)
    if (sessionStorage.getItem('exchangeRequestId') && sessionStorage.getItem('hash')) {
      if (props.data.status === 'New') return props.setStep(2)
      else if (props.data.status === 'WaitingCashoutInfo') props.setStep(3)
      else if (props.data.status === 'WaitingCashin') props.setStep(4)
    }
    const youGive = props.data.currencyes.fiat.find((curr) => curr.shortName === selectedYouGive)
    const youGet = props.data.currencyes.crypto.find((curr) => curr.shortName === selectedYouGet)
    if (!exchangeRequestId && !hash) {
      const
        currencyInId = youGive.id,
        currencyOutId = youGet.id,
        amountOut = amountGet,
        amountIn = Number(amountGive),
        partnerUserId = partner,
        cryptoAddress = props.data?.cryptoAddress,
        kycShareToken = props.data?.query?.kycsharetoken,
        params = { partnerUserId, currencyInId, amountIn, currencyOutId, amountOut, cryptoAddress, kycShareToken }

      props.submitButton({disabled: true})
      if (sessionStorage.getItem('userIdWallet')) {
        requests.ExchangeWallet({ partnerUserId, currencyInId, amountIn, currencyOutId, amountOut, tradeUserId: sessionStorage.getItem('userIdWallet') })
        .then(response => {
          sessionStorage.setItem('exchangeRequestId', response.id)
          sessionStorage.setItem('hash', response.hash)
          props.data.checkData()
          props.submitButton({disabled: false})
        }).catch(error => {
          props.submitButton({disabled: false})
          props.setData({ error: error.response.data })
        })
      } else {
        requests.Exchange(params).then(response => {
          props.submitButton({disabled: false})
          if (response && response.id && response.hash) {
            sessionStorage.setItem('exchangeRequestId', response.id)
            sessionStorage.setItem('hash', response.hash)
            props.data.checkData()
            props.setStep(2)
          }
        })
      }
    } 
    else if (props.data.status === 'WaitingCashoutInfo') props.setStep(3)
    else if (props.data.status === 'WaitingCashin') props.setStep(4)
    else props.setStep(2)
  }

  function listCryptoCurrencyes() {
    return props.data.currencyes.crypto.map((curr) => ({ id: curr.id, name: curr.shortName }))
  }
  function listFiatCurrencyes() {
    return props.data.currencyes.fiat.map((curr) => ({ id: curr.id, name: curr.shortName }))
  }

  const computedPositionHint = () => {
    const el = document.getElementById('hint')
    const rect = el?.getBoundingClientRect()
    if (rect?.bottom < 500) return styles.abroad
  }

  return (
    <div className={styles.orderData}>
      <div className={styles.orderData__currencyes}>
        <YouPay
          styles={'currencyes'}
          currency={selectedYouGive}
          selectedGive={curr => {
            if (props.data.id && props.data.currencyIn && curr != props.data.currencyIn.shortName) {
              props.data.cancelPayment(props.data?.cancelReturnUrl)
              const currIn = props.data.currencyes.fiat.find(el => el.shortName === curr)
              props.setData({currencyIn: currIn})
            }
            setSelectedYouGive(curr)
          }}
          amount={amountGive}
          setAmountGive={amount => {
            if (Math.sign(amount) >= 0) {
              if (props.data.id && props.data.amountIn && amount != props.data.amountIn) {
                props.setData({amountIn: amount})
                props.data.cancelPayment(props.data?.cancelReturnUrl)
              } else setAmountGive(amount)
            }
          }}
          items={listFiatCurrencyes()}
          error={errorGive}
          disabled={props.disabledGive}
        />
        <YouGet
          currency={selectedYouGet}
          selectedGive={curr => {
            if (props.data.id && props.data.currencyOut && curr != props.data.currencyOut.shortName) {
              props.data.cancelPayment(props.data?.cancelReturnUrl)
              const currOut = props.data.currencyes.crypto.find(el => el.shortName === curr)
              props.setData({currencyOut: currOut})
            }
            setSelectedYouGet(curr)
          }}
          amount={amountGet}
          items={listCryptoCurrencyes()}
          disabled={props.disabledGet}
          loader={loadingGet}
        />
      </div>
      { errorGive ?
        <p className={styles.orderData__errorConverter}>{errorGive}</p>
        :
        <p className={styles.orderData__priceOeCrypto}>{priceOneCrypto}</p>
      }
      <div className={styles.orderData__infoYouPay}>
        <span><b>{amountGive} {selectedYouGive}</b> is all you pay, all fees included</span>
        <p id='hint' className={styles.hint}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 15C3.35775 15 0 11.6422 0 7.5C0 3.35775 3.35775 0 7.5 0C11.6422 0 15 3.35775 15 7.5C15 11.6422 11.6422 15 7.5 15ZM7.5 13.5C9.0913 13.5 10.6174 12.8679 11.7426 11.7426C12.8679 10.6174 13.5 9.0913 13.5 7.5C13.5 5.9087 12.8679 4.38258 11.7426 3.25736C10.6174 2.13214 9.0913 1.5 7.5 1.5C5.9087 1.5 4.38258 2.13214 3.25736 3.25736C2.13214 4.38258 1.5 5.9087 1.5 7.5C1.5 9.0913 2.13214 10.6174 3.25736 11.7426C4.38258 12.8679 5.9087 13.5 7.5 13.5ZM6.75 9.75H8.25V11.25H6.75V9.75ZM8.25 8.51625V9H6.75V7.875C6.75 7.67609 6.82902 7.48532 6.96967 7.34467C7.11032 7.20402 7.30109 7.125 7.5 7.125C7.71306 7.12499 7.92173 7.06447 8.10174 6.9505C8.28175 6.83652 8.4257 6.67377 8.51683 6.48119C8.60796 6.2886 8.64252 6.0741 8.61651 5.86263C8.59049 5.65117 8.50496 5.45144 8.36987 5.28668C8.23478 5.12193 8.05568 4.99892 7.85341 4.93198C7.65115 4.86503 7.43403 4.8569 7.22732 4.90853C7.02061 4.96016 6.83281 5.06942 6.68577 5.22361C6.53874 5.3778 6.43851 5.57057 6.39675 5.7795L4.92525 5.48475C5.01647 5.02881 5.22713 4.60528 5.53569 4.25744C5.84425 3.9096 6.23964 3.64994 6.68144 3.50499C7.12324 3.36004 7.59561 3.33501 8.05026 3.43246C8.50491 3.52991 8.92552 3.74633 9.26911 4.05962C9.6127 4.3729 9.86694 4.7718 10.0058 5.21555C10.1447 5.65929 10.1633 6.13196 10.0596 6.58523C9.95599 7.0385 9.73384 7.45612 9.41589 7.7954C9.09794 8.13467 8.6956 8.38343 8.25 8.51625Z" fill="var(--InfoYouPay-Text)"/>
          </svg>
          <span className={computedPositionHint()}>
            Why are fees necessary?<br /><br />
            To process your payment, we need to pay bank and payment gateway fees, as well as cover legal expenses and maintenance costs.
          </span>
        </p>
      </div>
    </div>
  )
}


// Хук useDebounce для обработки множественного вызова конвертера
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      const handler = setTimeout(() => { setDebouncedValue(value) }, delay);
      return () => { clearTimeout(handler) }
    },
    [value]
  )
  return debouncedValue;
}

export default OrderData
