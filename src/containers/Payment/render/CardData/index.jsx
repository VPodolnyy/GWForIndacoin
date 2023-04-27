import React, { useState, useEffect } from "react"
import styles from "./styles.sass"
import requests from "@requests/request"

// components
import { CardNumber, CardValidThtu, CardCvc } from "@components/Card"
import Trustpayments from "@containers/Payment/Trustpayments"
import { Input } from '@components/Base'


function OrderData(props) {
  const [TrustpaymentsJWT, setTrustpaymentsJWT] = useState(null)
  const [errorCardHolderName, seterrorCardHolderName] = useState(null)

  const [cardNumber, setCardNumber] = useState(null)
  const [validThru, setValidThru] = useState(null)
  const [cvc, setCvc] = useState(null)
  const [fullNameCard, setFullNameCard] = useState(null)

  useEffect(() => {
    if (props.submit) submitData()
    if (props.backStep) backStep()
  }, [props.submit, props.backStep])

  useEffect(()=>{
    if(TrustpaymentsJWT) props.setPaymentsFlag()
  }, [TrustpaymentsJWT])

  function validateCardHolderName(value) {
    setFullNameCard(value.toUpperCase())
    if (/^(?:[А-яA-zÀ-ž\x20]*){1,}$/g.test(value)) seterrorCardHolderName(null)
    else seterrorCardHolderName('incorrectly entered name on the card')
  }

  useEffect(() => {
    if (fullNameCard && cardNumber && cvc && validThru && !errorCardHolderName) return props.submitButton({disabled: false})
    return props.submitButton({disabled: true})
  }, [fullNameCard, cardNumber, cvc, validThru, errorCardHolderName])

  function backStep() {
    props.setBackStep(false)
    props.data.setStep(1)
  }

  function submitData() {
    props.setSubmit(false)
    const params = {
      id: props.data.id,
      hash: props.data.hash,
      card: {
        cardNumber: cardNumber,
        cardHolder: fullNameCard,
        cvv: cvc,
        cardExpiryMonth: validThru[0] + validThru[1],
        cardExpiryYear: validThru[3] + validThru[4],
      },
      userAgentInfo: {
        windowInnerWidth: window.innerWidth,
        windowInnerHeight: window.innerHeight,
        browserScreenColorDepth: window.screen.colorDepth,
        browserJavaEnabled: true,
        browserTimeZone: 0,
        browserScreenWidth: window.screen.width,
        browserScreenHeight: window.screen.height
      }
    }
    // Отправка данных карты и получение 3ds
    props.submitButton({disabled: true, loading: true})
    requests.TestPurchase(params.id, params.hash, {card: params.card})
      .then(response => {
        console.log(response)
        return window.location.reload()
      })
      .catch(err => {
        requests.Cashin(params).then(response => {
          props.submitButton({disabled: false, loading: false})
          if (response.isSuccess) {
            switch (response.threeDSecure.threeDSecureType) {
              case 'JWT':
                setTrustpaymentsJWT(response.threeDSecure.value)
                break;
              case 'HtmlForm':
                let div = document.createElement('div');
                div.setAttribute('id', 'Connectum');
                div.innerHTML = response.threeDSecure.value;
                div.style.cssText = `overflow: hidden; width: 0; height: 0;`;
                document.body.appendChild(div);
                document.body.querySelector('div#Connectum form').submit();
                break;
              case 'ThreeDSecure20':
                return window.location.href = window.location.origin + '/status'
            }
          }
          else props.setData({error: response.message})
        }).catch(error => {
          props.submitButton({disabled: false, loading: false})
          props.setData({error: error.response.data})
        })
    })}
  return (
    <>
      {
        TrustpaymentsJWT ?
          <Trustpayments token={TrustpaymentsJWT} />
          :
          <div className={styles.cardData}>
            <div className={styles.cardData__header}>
              { sessionStorage.getItem('userIdWallet') ? null :
              <svg className={styles.cardData__img} width="188" height="140" viewBox="0 0 188 140" fill="none">
                <path d="M68.9985 0V11.0227M68.9985 17.4783V28M72.5 14.2706H83M65.5 14.2703H55M71.5 11.7637L79 4.24824M66.4986 11.7652L58.9985 4.24969M66.4986 16.7755L59.4986 23.7899M71.4985 16.7755L78.4985 23.7899" stroke="var(--Icon-Card)" strokeWidth="0.75"/>
                <path d="M137.383 15C136.502 19.787 135.787 20.502 131 21.383C135.787 22.264 136.502 22.979 137.383 27.766C138.264 22.979 138.979 22.264 143.766 21.383C138.979 20.502 138.264 19.787 137.383 15Z" fill="var(--Icon-Card)"/>
                <path d="M16.383 55C15.502 59.787 14.787 60.502 10 61.383C14.787 62.264 15.502 62.979 16.383 67.766C17.264 62.979 17.979 62.264 22.766 61.383C17.979 60.502 17.264 59.787 16.383 55Z" fill="var(--Icon-Card)"/>
                <path d="M111.383 116C110.502 120.787 109.787 121.502 105 122.383C109.787 123.264 110.502 123.979 111.383 128.766C112.264 123.979 112.979 123.264 117.766 122.383C112.979 121.502 112.264 120.787 111.383 116Z" fill="var(--Icon-Card)"/>
                <circle cx="102" cy="47" r="22.625" stroke="var(--Icon-Card)" strokeWidth="0.75"/>
                <circle cx="102" cy="47" r="28.625" stroke="var(--Icon-Card)" strokeWidth="0.75"/>
                <line x1="91.7348" y1="56.7348" x2="111.735" y2="36.7348" stroke="var(--Icon-Card)" strokeWidth="0.75"/>
                <line x1="96.7348" y1="56.7348" x2="110.735" y2="42.7348" stroke="var(--Icon-Card)" strokeWidth="0.75"/>
                <path d="M80.2695 65.3867L71.7843 73.872L76.0269 78.1146L84.5122 69.6294" stroke="var(--Icon-Card)" strokeWidth="0.75"/>
                <path d="M47.7724 95.6407L70.6459 72.7673L77.13 79.2515L54.2566 102.125C52.4661 103.915 49.563 103.915 47.7724 102.125C45.9819 100.334 45.9819 97.4313 47.7724 95.6407Z" stroke="var(--Icon-Card)" strokeWidth="0.75"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M173.373 47.0172C174.267 47.0999 175.076 47.4768 175.702 48.0501L183.449 40.2868L183.98 40.8166L176.205 48.6069C176.689 49.2531 176.981 50.0503 176.999 50.9149H188V51.6649H176.945C176.814 52.4464 176.457 53.1511 175.943 53.7092L183.442 61.2243L182.912 61.7541L175.412 54.2386L175.694 53.9572C175.069 54.5264 174.263 54.9004 173.373 54.9828V66H172.623V54.9825C171.714 54.8976 170.894 54.5085 170.264 53.918L170.585 54.2386L163.085 61.7541L162.554 61.2243L170.054 53.7088L170.088 53.742C169.557 53.1787 169.188 52.4616 169.055 51.6646H158V50.9146H169.001C169.019 50.0509 169.311 49.2545 169.793 48.6087L162.019 40.8181L162.55 40.2883L170.297 48.0516C170.922 47.4782 171.73 47.1009 172.623 47.0175V36H173.373V47.0172Z" fill="var(--Icon-Card)"/>
                <circle cx="18" cy="122" r="17.625" stroke="var(--Icon-Card)" strokeWidth="0.75"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M18.5 139.153C18.881 139.007 19.3009 138.687 19.7464 138.121C20.3902 137.304 21.0028 136.076 21.5311 134.491C21.5876 134.321 21.643 134.148 21.6971 133.972C20.6403 133.894 19.5743 133.849 18.5 133.839V139.153ZM18.5 139.993C22.9639 139.871 27.022 138.125 30.1041 135.323L30.1891 135.344L30.2218 135.215C33.7753 131.927 36 127.223 36 122V121.25H35.9847C35.5983 111.822 27.9604 104.265 18.5 104.007V104H18H17.75V104.002C8.17454 104.132 0.405148 111.739 0.0153417 121.25H0V122C0 127.171 2.18029 131.832 5.67168 135.115L5.73473 135.363L5.89591 135.323C9.03538 138.177 13.1877 139.936 17.75 139.998V140H18H18.5V139.993ZM17.75 139.225V133.837C16.5911 133.843 15.4416 133.888 14.3029 133.972C14.357 134.148 14.4124 134.321 14.4689 134.491C14.9972 136.076 15.6098 137.304 16.2536 138.121C16.7988 138.813 17.3057 139.138 17.75 139.225ZM18.5 133.089C19.6465 133.1 20.7839 133.149 21.9109 133.236C22.3322 131.701 22.6703 129.939 22.9014 128.016C21.4472 127.907 19.9795 127.848 18.5 127.837V133.089ZM17.75 127.837V133.087C16.5188 133.093 15.298 133.143 14.0891 133.236C13.6684 131.703 13.3305 129.943 13.0994 128.023C14.6352 127.906 16.186 127.844 17.75 127.837ZM18.5 127.087C20.0076 127.098 21.5031 127.159 22.9848 127.27C23.1568 125.609 23.25 123.839 23.25 122H18.5V127.087ZM17.75 122V127.087C16.1579 127.094 14.5793 127.158 13.0159 127.277C12.8435 125.615 12.75 123.842 12.75 122H17.75ZM18.5 121.25H23.2448C23.2253 119.842 23.1512 118.48 23.0292 117.18C21.533 117.295 20.0227 117.36 18.5 117.373V121.25ZM17.75 117.375V121.25H12.7552C12.7746 119.845 12.8485 118.485 12.97 117.188C14.5484 117.307 16.1424 117.37 17.75 117.375ZM18.5 116.623C19.9971 116.61 21.4821 116.547 22.9532 116.434C22.7429 114.524 22.4279 112.764 22.0307 111.216C20.8645 111.308 19.6871 111.361 18.5 111.372V116.623ZM17.75 111.374V116.625C16.1679 116.62 14.5993 116.558 13.046 116.441C13.2563 114.528 13.5716 112.766 13.9693 111.216C15.2173 111.315 16.4781 111.368 17.75 111.374ZM18.5 110.622C19.6196 110.611 20.7303 110.563 21.8309 110.479C21.7349 110.144 21.6349 109.821 21.5311 109.509C21.0028 107.924 20.3902 106.696 19.7464 105.879C19.3009 105.313 18.881 104.993 18.5 104.847V110.622ZM17.75 104.775V110.624C16.5457 110.618 15.3516 110.569 14.1691 110.479C14.2651 110.144 14.3651 109.821 14.4689 109.509C14.9972 107.924 15.6098 106.696 16.2536 105.879C16.7988 105.187 17.3057 104.862 17.75 104.775ZM12.3514 128.084C12.5798 129.993 12.9127 131.752 13.3293 133.3C12.1345 133.41 10.9518 133.561 9.78255 133.753C8.88448 132.28 8.14986 130.564 7.6287 128.673C9.18494 128.42 10.7599 128.223 12.3514 128.084ZM23.7326 127.33C23.9064 125.646 24 123.856 24 122H29.25C29.25 124.087 29.0067 126.083 28.5633 127.928C26.9716 127.671 25.3606 127.47 23.7326 127.33ZM23.9949 121.25H29.2395C29.193 119.593 28.993 117.999 28.6621 116.5C27.0527 116.766 25.4235 116.973 23.7767 117.118C23.9006 118.44 23.9754 119.824 23.9949 121.25ZM29.3047 128.053C29.7548 126.161 30 124.124 30 122H35.25C35.25 124.489 34.7228 126.855 33.7739 128.993C32.3031 128.629 30.8127 128.315 29.3047 128.053ZM29.9898 121.25H35.234C35.1457 119.186 34.6946 117.215 33.9429 115.401C32.449 115.778 30.9348 116.102 29.4021 116.374C29.7405 117.917 29.9434 119.553 29.9898 121.25ZM2.23603 129.015C1.28091 126.872 0.75 124.498 0.75 122H6C6 124.13 6.2466 126.173 6.6993 128.069C5.19319 128.334 3.7048 128.649 2.23603 129.015ZM7.44044 127.944C6.99472 126.094 6.75 124.093 6.75 122H12C12 123.859 12.0939 125.652 12.2683 127.339C10.6412 127.481 9.03118 127.684 7.44044 127.944ZM6.76051 121.25H12.0051C12.0246 119.827 12.0991 118.446 12.2225 117.127C10.5749 116.984 8.94479 116.779 7.33446 116.516C7.00559 118.011 6.80688 119.599 6.76051 121.25ZM0.766011 121.25H6.01023C6.05642 119.56 6.25802 117.929 6.59418 116.39C5.05963 116.121 3.54349 115.798 2.04775 115.424C1.30165 117.232 0.85395 119.194 0.766011 121.25ZM13.2121 111.15C12.8177 112.714 12.5064 114.478 12.2981 116.381C10.6835 116.241 9.08597 116.041 7.50766 115.784C7.98777 113.892 8.67951 112.164 9.5349 110.667C10.7465 110.872 11.9728 111.033 13.2121 111.15ZM15.9985 105.026C14.9808 106.106 14.0891 107.986 13.4077 110.415C12.2435 110.308 11.091 110.161 9.95159 109.975C10.0133 109.879 10.0757 109.783 10.1388 109.688C11.7472 107.275 13.7806 105.644 15.9985 105.026ZM15.9985 138.974C13.8205 138.368 11.8205 136.783 10.2261 134.442C11.3186 134.27 12.423 134.133 13.538 134.034C14.2012 136.246 15.0444 137.962 15.9985 138.974ZM20.0015 138.974C22.1795 138.368 24.1795 136.783 25.7739 134.442C24.6814 134.27 23.577 134.133 22.462 134.034C21.7988 136.246 20.9556 137.962 20.0015 138.974ZM22.6707 133.3C23.8654 133.41 25.0482 133.561 26.2174 133.753C27.118 132.276 27.8541 130.555 28.3755 128.658C26.8182 128.407 25.2422 128.212 23.6496 128.076C23.4211 129.987 23.0879 131.75 22.6707 133.3ZM23.7009 116.372C25.3145 116.23 26.9111 116.028 28.4884 115.769C28.0084 113.882 27.3181 112.16 26.4651 110.667C25.2535 110.872 24.0272 111.033 22.7879 111.15C23.1817 112.712 23.4926 114.472 23.7009 116.372ZM22.5923 110.415C23.7565 110.308 24.909 110.161 26.0484 109.975C25.9867 109.879 25.9243 109.783 25.8612 109.688C24.2528 107.275 22.2194 105.643 20.0015 105.026C21.0192 106.106 21.9109 107.986 22.5923 110.415ZM8.99028 133.89C8.11148 132.392 7.39593 130.674 6.88537 128.798C5.42715 129.053 3.98576 129.356 2.56297 129.707C3.46275 131.505 4.6677 133.125 6.10996 134.498C7.05986 134.268 8.02025 134.065 8.99028 133.89ZM6.76575 115.659C7.2377 113.779 7.91346 112.048 8.75266 110.528C7.73551 110.339 6.72907 110.12 5.73433 109.871C4.3461 111.275 3.19711 112.915 2.35354 114.727C3.80547 115.088 5.27683 115.399 6.76575 115.659ZM9.1531 109.839C10.3258 107.92 11.7722 106.384 13.3994 105.37C10.7467 106.103 8.35033 107.452 6.3747 109.256C7.29118 109.476 8.21758 109.67 9.1531 109.839ZM26.8469 109.839C25.6742 107.92 24.2278 106.384 22.6006 105.37C25.2533 106.103 27.6497 107.452 29.6253 109.256C28.7088 109.476 27.7824 109.67 26.8469 109.839ZM29.23 115.642C28.7583 113.768 28.084 112.044 27.2473 110.528C28.2645 110.339 29.2709 110.12 30.2657 109.871C31.6482 111.269 32.7935 112.902 33.6361 114.705C32.1862 115.067 30.7169 115.38 29.23 115.642ZM27.0097 133.89C27.8911 132.388 28.6083 130.664 29.1191 128.782C30.5795 129.034 32.023 129.336 33.4479 129.685C32.547 131.492 31.3381 133.12 29.89 134.498C28.9401 134.268 27.9797 134.065 27.0097 133.89ZM22.6005 138.63C24.1089 137.69 25.4617 136.302 26.5853 134.576C27.4697 134.73 28.346 134.908 29.2136 135.108C27.3203 136.73 25.0716 137.948 22.6005 138.63ZM13.3994 138.63C11.8911 137.69 10.5383 136.302 9.41467 134.576C8.5303 134.73 7.65398 134.908 6.78639 135.108C8.67971 136.73 10.9284 137.948 13.3994 138.63Z" fill="var(--Icon-Card)"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M34.375 31.4527C35.022 31.2862 35.5 30.6989 35.5 30C35.5 29.1716 34.8284 28.5 34 28.5C33.1716 28.5 32.5 29.1716 32.5 30C32.5 30.6989 32.978 31.2862 33.625 31.4527L33.625 63C33.625 65.4162 35.5838 67.375 38 67.375L45 67.375H60H67C69.002 67.375 70.625 68.998 70.625 71V73H71.375V71C71.375 68.5838 69.4162 66.625 67 66.625H60H45L38 66.625C35.998 66.625 34.375 65.002 34.375 63L34.375 31.4527ZM154 111C154 111.828 153.328 112.5 152.5 112.5C151.801 112.5 151.214 112.022 151.047 111.375H114C111.584 111.375 109.625 109.416 109.625 107V97V95C109.625 92.998 108.002 91.375 106 91.375H97H84L75 91.375C72.5838 91.375 70.625 89.4162 70.625 87V85.5H71.375V87C71.375 89.002 72.998 90.625 75 90.625L84 90.625H97H106C108.416 90.625 110.375 92.5838 110.375 95V97V107C110.375 109.002 111.998 110.625 114 110.625H151.047C151.214 109.978 151.801 109.5 152.5 109.5C153.328 109.5 154 110.172 154 111Z" fill="var(--Icon-Card)"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M55.375 47.4527C56.022 47.2862 56.5 46.6989 56.5 46C56.5 45.1716 55.8284 44.5 55 44.5C54.1716 44.5 53.5 45.1716 53.5 46C53.5 46.6989 53.978 47.2862 54.625 47.4527L54.625 88.5H55.375L55.375 47.4527ZM162.5 81.5C163.328 81.5 164 80.8284 164 80C164 79.1716 163.328 78.5 162.5 78.5C161.801 78.5 161.214 78.978 161.047 79.625L97 79.625C94.5838 79.625 92.625 81.5838 92.625 84V90V95V101C92.625 103.002 91.002 104.625 89 104.625H81H74L58.7 104.625C56.8637 104.625 55.375 103.136 55.375 101.3H54.625C54.625 103.551 56.4494 105.375 58.7 105.375L74 105.375H81H89C91.4162 105.375 93.375 103.416 93.375 101V95V90V84C93.375 81.998 94.998 80.375 97 80.375L161.047 80.375C161.214 81.022 161.801 81.5 162.5 81.5Z" fill="var(--Icon-Card)"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M145.375 49.4527C146.022 49.2862 146.5 48.6989 146.5 48C146.5 47.1716 145.828 46.5 145 46.5C144.172 46.5 143.5 47.1716 143.5 48C143.5 48.6989 143.978 49.2862 144.625 49.4527V95C144.625 97.002 143.002 98.625 141 98.625H132H117L108 98.625C105.584 98.625 103.625 100.584 103.625 103V106V114V117C103.625 119.002 102.002 120.625 100 120.625H67H65H45C42.998 120.625 41.375 119.002 41.375 117V110L41.375 97L41.375 90C41.375 87.5838 39.4162 85.625 37 85.625H15.9527C15.7862 84.978 15.1989 84.5 14.5 84.5C13.6716 84.5 13 85.1716 13 86C13 86.8284 13.6716 87.5 14.5 87.5C15.1989 87.5 15.7862 87.022 15.9527 86.375H37C39.002 86.375 40.625 87.998 40.625 90L40.625 97L40.625 110V117C40.625 119.416 42.5838 121.375 45 121.375H65H67H100C102.416 121.375 104.375 119.416 104.375 117V114V106V103C104.375 100.998 105.998 99.375 108 99.375L117 99.375H132H141C143.416 99.375 145.375 97.4162 145.375 95V49.4527Z" fill="var(--Icon-Card)"/>
              </svg>
              }
              <h3>Provide your card details</h3>
            </div>
            <div className={styles.cardData__Inputs}>
              <div className={styles.rowTop__Input}>
                <CardNumber
                  setCard={(value) => setCardNumber(value)}
                />
                <CardValidThtu
                  setDateCard={(value) => setValidThru(value)}
                />
              </div>
              <div className={styles.rowBottom__Input}>
                <Input
                  label={'Card holder name'}
                  error={false}
                  value={fullNameCard}
                  disabled={false}
                  onChange={(value) => validateCardHolderName(value)}
                  onBlur={(value) => validateCardHolderName(value)}
                  required={'required'}
                />
                <CardCvc
                  setCvcCard={(value) => setCvc(value)}
                />
              </div>
            </div>
          </div>
      }
    </>
  )
}

export default OrderData