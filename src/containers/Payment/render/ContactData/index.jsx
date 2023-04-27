// tools
import React, { useState, useEffect } from "react"
import styles from "./styles.sass"

// components
import { InputChecked } from "@components/Base"
import { Email, VerifyContact } from '@components/Contact'

// request
import Request from '@requests/request'

const ContactData = (props) => {
  const [step, setStep] = useState('Contact')
  const [valueEmail, setValueEmail] = useState('')

  const [errorContact, setErrorContact] = useState(null)
  const [errorVerify, setErrorVerify] = useState(null)
  const [verifyCode, setVerifyCode] = useState(null)
  const [checkedTerms, setCheckedTerms] = useState(true)

  useEffect(() => {
    if (props.data.query?.email) validateEmail(props.data.query.email)
  }, [])

  useEffect(() => {
    if (props.submit) nextStep()
    if (props.backStep) backStep()
  }, [props.submit, props.backStep])

  useEffect(() => {
    if (valueEmail && !errorContact && checkedTerms) props.submitButton({ disabled: false })
    else props.submitButton({ disabled: true })
  }, [valueEmail, errorContact, checkedTerms])

  function validateEmail(value) {
    setValueEmail(value)
    if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
      setErrorContact(null)
    } else setErrorContact('Incorrect email address')
  }

  const checkPinCode = pinCode => {
    if (pinCode.length === 6 && pinCode != verifyCode) {
      setVerifyCode(pinCode)
      Request.Verify(props.data.id, props.data.hash, pinCode)
        .then(response => {
          props.submitButton({ disabled: false, loading: false })
          if (response.status === 200) {
            props.renewData()
            // nextStep()
          }
        }).catch(error => {
          if (error.response?.data) props.setData({ error: error.response.data })
          else props.setData({ error: 'internal Server Error' })
        })
    }
  }

  function getNewCode() {
    Request.Sendcode(props.data.id, props.data.hash)
      .then(response => console.log(response))
      .catch(error => props.setData({ error: error.response.data }))
  }

  function nextStep() {
    props.setSubmit(false)
    if (step === 'Contact') {
      props.submitButton({disabled: true, loading: true})
      const params = {
        value: valueEmail,
        type: 'Email',
        requestId: props.data.id,
        requestHash: props.data.hash
      }
      Request.AddContacts(params).then(() => {
        props.submitButton({loading: false})
        setStep('Verify')
        setErrorVerify(null)
      }).catch(error => {
        props.submitButton({disabled: false, loading: false})
        if (error.response.status === 400) props.setData({ error: error.response.title })
        else if (error.response.status === 500) props.setData({ error: 'One or more fields are filled out incorrectly' })
        else if (error.response.status === 429) props.setData({ error: 'Too many requests. Please wait a minute and try again' })
        else props.setData({ error: 'Internal server Error. Please contact technical support' })
      })
    }
    else if (props.data.type === 'DepositRequest') props.data.setStep(4)
    else props.data.setStep(3)
  }

  function backStep() {
    props.submitButton({ disabled: false })
    props.setBackStep(false)
    if (step === 'Verify') setStep('Contact')
    else props.data.setStep(1)
  }

  return (
    <>
      <div className={styles.ContactData__main}>
        {
          step === 'Contact' ?
            <div className={styles.fieldContact}>
              <div className={styles.fieldContact__header}>
                <svg className={styles.contact__img} width="257" height="141" viewBox="0 0 257 141">
                  <path d="M246 34C245.31 37.75 244.75 38.3097 241 39C244.75 39.6904 245.31 40.25 246 44C246.69 40.25 247.25 39.6903 251 39C247.25 38.3097 246.69 37.75 246 34Z" fill="var(--Icon-Email)"/>
                  <path d="M199.375 99C198.633 103.031 198.031 103.633 194 104.375C198.031 105.117 198.633 105.719 199.375 109.75C200.117 105.719 200.719 105.117 204.75 104.375C200.719 103.633 200.117 103.031 199.375 99Z" fill="var(--Icon-Email)"/>
                  <path d="M167 44C166.448 47 166 47.4477 163 48C166 48.5523 166.448 49 167 52C167.552 49 168 48.5523 171 48C168 47.4477 167.552 47 167 44Z" fill="var(--Icon-Email)"/>
                  <path d="M131 133C130.448 136 130 136.448 127 137C130 137.552 130.448 138 131 141C131.552 138 132 137.552 135 137C132 136.448 131.552 136 131 133Z" fill="var(--Icon-Email)"/>
                  <path d="M73 94C72.5858 96.25 72.25 96.5858 70 97C72.25 97.4142 72.5858 97.75 73 100C73.4142 97.75 73.75 97.4142 76 97C73.75 96.5858 73.4142 96.25 73 94Z" fill="var(--Icon-Email)"/>
                  <path d="M113.5 65C113.155 66.875 112.875 67.1548 111 67.5C112.875 67.8452 113.155 68.125 113.5 70C113.845 68.125 114.125 67.8452 116 67.5C114.125 67.1548 113.845 66.875 113.5 65Z" fill="var(--Icon-Email)"/>
                  <path d="M45 42C44.5858 44.25 44.25 44.5858 42 45C44.25 45.4142 44.5858 45.75 45 48C45.4142 45.75 45.75 45.4142 48 45C45.75 44.5858 45.4142 44.25 45 42Z" fill="var(--Icon-Email)"/>
                  <path d="M124.5 0C124.017 2.625 123.625 3.01679 121 3.5C123.625 3.98325 124.017 4.37503 124.5 7C124.983 4.37503 125.375 3.98321 128 3.5C125.375 3.01679 124.983 2.625 124.5 0Z" fill="var(--Icon-Email)"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M139.893 105.75L139.75 105.75V136.25L139.893 136.25L158.048 121L139.893 105.75ZM158.631 121.49L141.059 136.25L186.941 136.25L169.369 121.49L164 126L158.631 121.49ZM169.952 121L188.107 136.25L188.25 136.25V105.75L188.107 105.75L169.952 121ZM189 137V136.25V105.75V105H188.25H140.166H139.75H139V105.75V136.25V137H139.75L140.166 137L187.834 137L188.25 137H189ZM164 125.021L141.059 105.75L186.941 105.75L164 125.021Z" fill="var(--Icon-Email)"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M182.893 49.75L182.75 49.75V96.25L182.893 96.25L210.571 73L182.893 49.75ZM211.154 73.4898L184.059 96.25L254.941 96.25L227.846 73.4897L219.5 80.5L211.154 73.4898ZM228.429 73L256.107 96.25L256.25 96.25V49.75L256.107 49.75L228.429 73ZM183.166 97L182.75 97H182V96.25V49.75V49H182.75H183.166H256.25H257V49.75V96.25V97L255.834 97L183.166 97ZM219.5 79.5205L184.059 49.75L254.941 49.75L219.5 79.5205Z" fill="var(--Icon-Email)"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M122.893 9.75L122.75 9.75V40.25L122.893 40.25L141.048 25L122.893 9.75ZM141.631 25.4897L124.059 40.25L169.941 40.25L152.369 25.4897L147 30L141.631 25.4897ZM152.952 25L171.107 40.25L171.25 40.25V9.75L171.107 9.75L152.952 25ZM172 41V40.25V9.75V9H171.25H123.166H122.75H122V9.75V40.25V41H122.75L123.166 41L170.834 41L171.25 41H172ZM147 29.0205L124.059 9.75L169.941 9.75L147 29.0205Z" fill="var(--Icon-Email)"/>
                  <line x1="48" y1="24.625" x2="52" y2="24.625" stroke="var(--Icon-Email)" strokeWidth="0.75"/>
                  <line y1="89.625" x2="4" y2="89.625" stroke="var(--Icon-Email)" strokeWidth="0.75"/>
                  <line x1="22" y1="55.625" x2="27" y2="55.625" stroke="var(--Icon-Email)" strokeWidth="0.75"/>
                  <line x1="65" y1="118.625" x2="70" y2="118.625" stroke="var(--Icon-Email)" strokeWidth="0.75"/>
                  <line x1="45" y1="55.625" x2="66" y2="55.625" stroke="var(--Icon-Email)" strokeWidth="0.75"/>
                  <line x1="14" y1="89.625" x2="27" y2="89.625" stroke="var(--Icon-Email)" strokeWidth="0.75"/>
                  <line x1="35" y1="89.625" x2="177" y2="89.625" stroke="var(--Icon-Email)" strokeWidth="0.75"/>
                  <line x1="77" y1="55.625" x2="177" y2="55.625" stroke="var(--Icon-Email)" strokeWidth="0.75"/>
                  <line x1="63" y1="24.625" x2="116" y2="24.625" stroke="var(--Icon-Email)" strokeWidth="0.75"/>
                  <line x1="79" y1="118.625" x2="133" y2="118.625" stroke="var(--Icon-Email)" strokeWidth="0.75"/>
                </svg>
                <h2>What’s your email address?</h2>
              </div>
              <Email
                label={'Your email address'}
                error={errorContact}
                value={valueEmail}
                required={'required'}
                validateEmail={email => validateEmail(email)}
              />
              <InputChecked
                checked={checkedTerms}
                error={null}
                onChange={() => setCheckedTerms(!checkedTerms)}
              >I agree to the <a href='https://indacoin.io/terms' target='_blank'>Term of Use</a> and <a href='https://indacoin.io/terms/amlpolicy' target='_blank'>Privacy Policy</a></InputChecked>
            </div>
            :
            <VerifyContact
              contact={valueEmail}
              handlePinChange={(pincode) => checkPinCode(pincode)}
              getNewCode={() => getNewCode()}
              setStep={() => backStep()}
              error={errorVerify} />
        }
      </div>
    </>
  );
}

export default ContactData