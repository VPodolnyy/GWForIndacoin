// tools
import React, { useEffect, useState } from "react"
import { useIsIframe, useOutsideAlerter } from '@tools/Hooks.jsx'
import requests from "@requests/request"

// styles img
import styles from "./styles.scss"
import Help from '@icons/help.svg'

// render
import Loader from '@components/Loader'
import KYC from "@containers/Status/render/KYC"
import CheckAmount from "@containers/Status/render/CheckAmount"
import StatusCashin from "@containers/Status/render/StatusCashin"
import Notifications from '@components/Notifications'
import AdditionalMenu from '@components/AdditionalMenu'

function StatusContainer(props) {
  const [loading, setLoading] = useState(true)
  const { ref, isShow, setIsShow } = useOutsideAlerter(false)
  const [needUpdateStatus, setNeedUpdateStatus] = useState(false)

  useEffect(() => {
    if (props.data.currencyes && props.data.countries && props.data.status) setLoading(false)
  }, [props.data])

  function checkStatus3ds() {
    requests.CashinCheck(props.data.id).then(response => {
      if (response.isSuccess) return props.data.checkData()
      else if (response.message) return window.location.href = window.location.origin + `?error=${response.message}`
      else window.location.reload()
    })
  }

  function computedHeaderContainer() {
    switch (props.step) {
      case 5: return
      case 6: return (
        <div className={styles.HeaderContainer}>
          {useIsIframe() ? <div /> :
            <>
              <span className={styles.step}>Step 3 of 3</span>
              <svg width="276" height="6" viewBox="0 0 276 6" fill="none">
                <rect width="276" height="6" rx="3" fill="#DADCE0"/>
                <rect width="237.667" height="6" rx="3" fill="var(--Color7)"/>
              </svg>
            </>
          }
          <svg onClick={() => setIsShow(true)} className={styles.help} width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="var(--Color7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>)
      case 7: return (<>{
        needUpdateStatus &&
        <div className={styles.HeaderContainer}>
          <span>Price updated</span>
          <svg onClick={() => setIsShow(true)} className={styles.help} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="var(--Color7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      }</>)
      case 8: return (
        <div className={styles.HeaderContainer}>
          <span><b>Great! {window.innerWidth < 440 ? <br /> : '' }Your order is registered</b></span>
          {
            useIsIframe() ? <div /> :
            <svg onClick={() => setIsShow(true)} className={styles.help} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="var(--Color7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        </div>)
    }
  }

  function router() {
    if (loading) return <Loader />
    switch (props.step) {
      case 5: return checkStatus3ds()
      case 6: return <div className={styles.constainerKYC}><KYC data={props.data} setStep={step => props.setStep(step)} /></div>
      case 7: return <CheckAmount data={props.data} renewData = {() => props.renewData()} needUpdateStatus={bool => setNeedUpdateStatus(bool)}/>
      case 8: return <StatusCashin data={props.data} renewData = {() => props.renewData()}/>
    }
  }

  return (
    <div className={styles.StatusContainer}>
      {computedHeaderContainer()}
      {router()}
      <Notifications text={props.data.error} clearMessage={() => props.setData({ error: null })} />
      { isShow && <AdditionalMenu ref={ref} data={props.data} step={props.step} setShow={() => setIsShow(false)}/> }
    </div>
  )
}

export default StatusContainer