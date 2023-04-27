import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// styles
import styles from "./styles.sass"

// containers
import PaymentContainer from "@containers/Payment"
import StatusContainer from "@containers/Status"

import Modal from '@components/Modal'
import { Button } from '@components/Base'

import LogoIndacoin from '@images/LogoIndacoin.png'
import LogoPreview from '@images/LogoPreview.png'

import templatePartners from '@tools/templatePartners.json'
import { useIsIframe, useQuery } from '@tools/Hooks.jsx'
import exchangeRequest from "@requests/request.jsx"

function MainContainer() {
  const [step, setStep] = useState(null)
  const navigate = useNavigate()
  const query = useQuery()
  const exchangeRequestId = query.id || sessionStorage.getItem('exchangeRequestId')
  const exchangeRequestHash = query.hash || sessionStorage.getItem('hash')
  const [data, setData] = useState({
    checkData: () => CheckDataPayment(),
    cancelPayment: cancelReturnUrl => CancelPayment(cancelReturnUrl),
    setStep: step => setStep(step),
    step: step,
    error: null,
    query: null,
    preview: false,
    error: null
  })
  const [cancelRequest, setCancelRequest] = useState(false)
  const [timerPreview, setTimerPreview] = useState(null)

  useEffect(() => getColors(data))

  useEffect(() => {
    getCurrencyAndCountries()
    if (exchangeRequestId && exchangeRequestHash) {
      sessionStorage.setItem('exchangeRequestId', exchangeRequestId)
      sessionStorage.setItem('hash', exchangeRequestHash)
      if (query.type === 'wallet' && query.userid) sessionStorage.setItem('userIdWallet', query.userid)
      CheckDataPayment()
      navigate("/", { replace: true })
    } else if (query.cur_from || query.cur_to || query.amount || query.address || query.partnerid || query.email || query.theme || query.type || query.userId || query.kycsharetoken || query.error) {
      if (query.type === 'wallet' && query.userid) sessionStorage.setItem('userIdWallet', query.userid)
      const obj = { query }
      const { amount, address, error } = query
      setData(data => ({ ...data, ...obj, amountIn: amount, cryptoAddress: address, error: error }))
      navigate("/", { replace: true })
    } else setStep(1)
  }, [])

  useEffect(() => {
    if (typeof timerPreview === 'number') {
      if (timerPreview === 0) setData(data => ({ ...data, preview: true }))
      else setTimeout(() => setTimerPreview(timerPreview - 1), 1000);
    }
  }, [timerPreview])

  // Получение валют
  function getCurrencyAndCountries() {
    let dataResponse = {}
    exchangeRequest.Currencies().then(({ crypto, fiat }) => {
      if (query.cur_from && query?.unblockgive) {
        const allowGive = query.cur_from.split('-')
        const currYouPay = fiat.find(curr => curr.shortName === allowGive[0].toUpperCase())
        console.log(currYouPay)
        setData(data => ({ ...data, currencyIn: currYouPay }))
      } else if (query.cur_from) {
        const listAllowGive = query.cur_from.split('-')
        fiat = fiat.filter(curr => listAllowGive
          .map(el => el.toUpperCase())
          .includes(curr.shortName.toUpperCase()))
      }
      if (query.cur_to && query?.unblockget) {
        const allowGet = query.cur_to.split('-')
        const currYouGet = crypto.find(curr => curr.shortName === allowGet[0].toUpperCase())
        setData(data => ({ ...data, currencyOut: currYouGet }))
      }
      else if (query.cur_to) {
        const listAllowGet = query.cur_to.split('-')
        crypto = crypto.filter(curr => listAllowGet
          .map(el => el.toUpperCase())
          .includes(curr.shortName.toUpperCase()))
      }
      dataResponse = { currencyes: { fiat, crypto } }
      exchangeRequest.Countries().then(countries => {
        dataResponse = { ...dataResponse, countries }
        setData(data => ({ ...data, ...dataResponse }))
      })
    })
  }

  function CheckDataPayment() {
    exchangeRequest.ExchangeCheck(sessionStorage.getItem('exchangeRequestId'), sessionStorage.getItem('hash')).then(response => {
      setData(data => ({ ...data, ...response }))
    })
  }

  function CancelPayment(cancelReturnUrl) {
    const idRequest = sessionStorage.getItem('exchangeRequestId')
    const hashRequest = sessionStorage.getItem('hash')
    if (idRequest && hashRequest) {
      exchangeRequest.CancelExchange(idRequest, hashRequest).then(() => {
        sessionStorage.setItem('exchangeRequestId', '')
        sessionStorage.setItem('hash', '')
        // Переадресация к партнеру если окно не в iframe и есть ссылка на редирект
        if (cancelReturnUrl && !useIsIframe()) return window.location.href = cancelReturnUrl
        else setData(data => ({...data, id: null, hash: null, amountIn: null, amountOut: null, status: null}))
      })
    } else setData(data => ({...data, error: 'There is nothing to cancel, there was no request to create'}))

  }

  function computedPreview() {
    if (!data.status && !useIsIframe() && data.query?.type !== 'wallet' && window.innerWidth < 450 && !data.preview) return true
    else return false
  }

  useEffect(() => {
    if (!data.status) setStep(1)
    else if (data.status === 'New' && data.type === 'GatewayRequest') setStep(2)
    else if (data.status === 'New' && data.type === 'DepositRequest') setStep(1)
    else if (data.status === 'WaitingCashoutInfo') setStep(3)
    else if (data.status === 'WaitingCashin') setStep(4)
    else if (data.status === 'WaitingCashinAuthorization') setStep(5)
    else if (data.status === 'WaitingKYC') setStep(6)
    else if (data.status === 'WaitingUserApprovement') setStep(7)
    else if (data.status === 'Processing' || data.status === 'Declined' || data.status === 'Completed') setStep(8)
  }, [data.status])

  function renderContainer() {
    switch (step) {
      case 1:
      case 2:
      case 3:
      case 4: return (
        <PaymentContainer
          data={data}
          setData={obj => setData(data => ({ ...data, ...obj }))}
          step={step}
          setStep={step => setStep(step)}
          renewData={() => CheckDataPayment()} />
      )
      case 5:
      case 6:
      case 7:
      case 8: return (
        <StatusContainer
        data={data}
        step={step}
        setStep={step => setStep(step)}
        renewData={() => CheckDataPayment()}/>
      )
    }
  }

  return (
    <div className={styles.mainContainer}>
      <main style={step === 1 ? {justifyContent: 'space-between'} : {justifyContent: 'center'}}>
        {step === 1 &&
          <section className={styles.info}>
            <h1>BE FIRST.<br /> BUY FIRST.</h1>
            <p>You can buy cryptocurrency with your bank card within 15 minutes. It is the easiest way to join the crypto market, add promising assets to your portfolio and become the active member of the new economy.</p>
          </section>
        }
        <section className={styles.container}>
          {computedPreview() &&
            <div className={styles.preview}>
              <img src={LogoPreview} className={styles.preview__shortLogo}/>
              <div className={styles.preview__middle}>
                <h2>WELCOME<br />TO INDA<img src={LogoIndacoin} className={styles.preview__shortLogo}/>IN</h2>
                <p>Your helping hand in fiat-to-crypto exchanges<br />with 8+ years of experience in web3</p>
              </div>

              <div className={styles.preview__bottom}>
                <p>700,000+ people use Indacoin</p>
                <Button
                  onClick={() => setData(data => ({ ...data, preview: true }))}
                  title={'CONTINUE'} />
                <span>or you will be redirected in {timerPreview || timerPreview === 0 ? timerPreview : setTimerPreview(5)} seconds</span>
              </div>

            </div>
          }
          {renderContainer()}
        </section>
      </main>
      <footer>
        <div className={styles.shadowFooter}></div>
        <p>
          It is strongly prohibited to make purchases of cryptocurrency on accounts of Forex, Gambling, Pharmacy, Steroid websites, Antivirus etc. All such transactions will be blocked and the fine of EUR 5 000 will be applied to the owner of the banking card. The fine of EUR 50 000 will be applied to the website that forwards such buyers to Indacoin.
        </p>
      </footer>
      {
        cancelRequest &&
        <Modal setToggleModal={() => setCancelRequest(false)}>
          Are you sure you want to make the change? Your current transaction will be cancelled.
          <button onClick={() => setCancelRequest(false)}>no</button>
          <button onClick={() => {CancelPayment(props.data?.cancelReturnUrl), setCancelRequest(false)}}>yes</button>
        </Modal>
      }
    </div>
  )
}

// TODO переписываем на хук
const getColors = props => {
  const query = useQuery()

  function changeTemplateColors(theme) {
    if (!templatePartners[theme]) return
    const colorKeys = Object.keys(templatePartners[theme].colorsSettings)
    colorKeys.forEach(key => {
      const colorParams = templatePartners[theme].colorsSettings[key]
      if (colorParams) {
        document.querySelector('*').style.setProperty('--' + key, colorParams)
      }
    })
  }

  if (query.partnerid || props.data?.partherId || sessionStorage.getItem('partnerId')) {
    const partnerId = query.partnerid || props.data?.partnerId || sessionStorage.getItem('partnerId')
    sessionStorage.setItem('partnerId', partnerId)
    changeTemplateColors(partnerId)
  } else if (query.theme === 'dark' || sessionStorage.getItem('theme') === 'dark') {
    sessionStorage.setItem('theme', 'dark')
    changeTemplateColors('dark')
  }
}

export default MainContainer