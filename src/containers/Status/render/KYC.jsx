import React, { useEffect, useState } from 'react';
import SumsubWebSdk from '@sumsub/websdk-react'
import Request from "@requests/request"
import styles from "../styles.scss"

function KYC(props) {
  const [kycToken, setKycToken] = useState(null)

  const templateStyles =
  ':root { --white-color: #121212; --primary-color: #ffffff; --success-color: #3463f8}\n' +
  'body { transition: none; }\n' +
  'section { background-color: transparent; }\n' +
  'button { border-radius: 8px;}\n' +
  'button.submit { background-image: none; background-color: #3463f8; color: #fff}\n' +
  'button.submit:hover:not(:disabled):not(.disabled):not(:active) {background-image: none;}\n' +
  'button.submit:active:not(:disabled) { background-image: none; }\n' +
  '.mobile-button { box-shadow: 0px 0px 13px #3463F8; }\n' +
  '.mobile-button:hover { box-shadow: 0px 0px 13px #3463F8; background-color: transparent;}\n' +
  '.upload-item {box-shadow: 0px 0px 13px #3463F8 !important;}\n' +
  '.country-selector .list li.active, .country-selector .list li:hover { background: #202021; border-bottom: 1px solid #3463F8 }' +
  '.country-selector .list li {background: #202021}'
  useEffect(() => kyc(), [])

  function kyc() {
    Request.AccessToken(props.data.id, props.data.hash).then(response => {
      setKycToken(response.accessToken)
      const checkStatus = setInterval(() => {
        props.data.checkData()
        if (props.data.status === 'WaitingUserApprovement') {
          clearInterval(checkStatus)
          props.setStep(7)
        }
      }, 20000);
    })
  }

  function onMessage(type, payload = {}) {
    const { reviewResult } = payload
    console.log(reviewResult)
    if (reviewResult && (reviewResult.reviewAnswer === 'GREEN' || reviewResult.reviewAnswer === 'RED')) {
      console.log(reviewResult.reviewAnswer)
      Request.Check(props.data.id, props.data.hash).then(() => {
        const checkStatus = setInterval(() => {
          props.data.checkData()
          if (props.data.status === 'WaitingUserApprovement') {
            clearInterval(checkStatus)
            props.setStep(7)
          }
        }, 1000)
      })
    }
  }
  return (
    <>
      {
        kycToken ?
          <SumsubWebSdk
            accessToken={kycToken}
            expirationHandler={() => console.log('token expired')}
            config={{uiConf: {customCssStr: sessionStorage.getItem('theme') === 'dark' ? templateStyles : ''}}}
            onMessage={(type, payload) => {
              onMessage(type, payload)
            }}
            onError={(e) => console.log('error', e)}
          />
          :
          <div className={styles.barsLoader}>
            <span /><span /><span /><span /><span /><span />
          </div>
      }
    </>
  )
}

export default KYC
