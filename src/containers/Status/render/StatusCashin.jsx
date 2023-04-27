// tools
import React, { useState, useEffect } from 'react'
import { useIsIframe } from '@tools/Hooks.jsx'
// styles
import styles from "@containers/Status/styles.scss"

import { Button } from '@components/Base'

function StatusTransaction(props) {
  const [timer, setTimer] = useState(null)

  useEffect(() => {
    const timerRenewData = setInterval(() => {
      if (props.data.status === 'Completed' || props.data.status === 'Declined') clearInterval(timerRenewData)
      else props.renewData()
    }, 5000);
    // Переадресация к партнеру через 5 секунд если окно не в iframe и есть ссылка на редирект
    if (props.data?.successReturnUrl && !useIsIframe()) {
      setTimeout(() => window.location.href = props.data.successReturnUrl, 5000)
    }
  }, [])

  useEffect(() => {
    // Сделано для партнера Chains по заявке IC-212
    if (props.data.status === 'Completed' && !timer && props.data.partnerId === 64) return setTimer(30)
  }, [props.data])

  useEffect(() => {
    if (typeof timer === 'number') {
      if (timer === 0) window.location.href = 'https://chains.com/'
      else setTimeout(() => setTimer(timer - 1), 1000);
    }
  }, [timer])

  function copyOrderId (el) {
    const copyToClipboard = () => {
      const textarea = document.createElement('textarea')
      textarea.value = props.data.id
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      el.classList.add('copied')
    }
    if (typeof navigator.clipboard === 'undefined') {
      copyToClipboard()
    } else {
      navigator.clipboard.writeText(props.data.id)
        .then(_ => el.classList.add('copied'))
        .catch(err => console.log('Something went wrong', err))
    }
  }

  function computedTextButton() {
    if (sessionStorage.getItem('userIdWallet') && !useIsIframe()) return 'MORE DETAILS'
    else return 'BUY AGAIN'
  }

  function computedHandlerButton() {
    const userIdWallet = sessionStorage.getItem('userIdWallet')
    sessionStorage.setItem('exchangeRequestId', '')
    sessionStorage.setItem('hash', '')
    sessionStorage.setItem('userIdWallet', '')
    sessionStorage.setItem('hash', '')
    if (userIdWallet)
      if (useIsIframe()) window.location.href = window.location.origin + `/?type=wallet&userId=${userIdWallet}&theme=dark`
      else window.location.href = `https://wallet.indacoin.io/Identity/Account/Register?ReturnUrl=&RequestId=${props.data.id}&Hash=${props.data.hash}`
    else window.location.href = window.location.origin
  }

  return (
    <>
      {props.data &&
        <div className={styles.StatusCashin}>
          <div className={styles.StatusCashin__main}>
            <div className={styles.StatusCashin__header}>
            { sessionStorage.getItem('userIdWallet') ? null : 
            <svg className={styles.StatusCashin__img} width="190" height="161" viewBox="0 0 190 161" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M20.3729 43.1803C21.6583 43.2691 22.8184 43.8133 23.6929 44.6527L34.0203 34.304L34.5512 34.8338L24.1969 45.2094C24.9088 46.1159 25.3334 47.2588 25.3334 48.5008C25.3334 48.5044 25.3334 48.508 25.3334 48.5115H40V49.2615H25.2795C25.1174 50.3967 24.5978 51.4167 23.8384 52.2037L33.8348 62.2207L33.3039 62.7505L23.3039 52.7299L23.5819 52.4524C22.7213 53.233 21.6046 53.7363 20.3729 53.8213V68.5H19.6229V53.821C18.3669 53.7332 17.2307 53.2106 16.3641 52.4026L16.692 52.7299L6.69196 62.7505L6.16108 62.2207L16.1596 52.2015C15.4012 51.4147 14.8824 50.3955 14.7205 49.2611H0V48.5111H14.6667C14.6667 48.5077 14.6667 48.5042 14.6667 48.5008C14.6667 47.2599 15.0905 46.1179 15.8013 45.2118L5.44668 34.8359L5.97756 34.3061L16.305 44.6548C17.1788 43.8151 18.3381 43.2704 19.6229 43.1806V28.5H20.3729V43.1803Z" fill="var(--Icon-Status)"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M84.3779 138.5C87.5199 144.696 109.882 149.5 137 149.5C166.271 149.5 190 143.904 190 137C190 135.027 188.061 133.16 184.607 131.5C188.061 129.84 190 127.974 190 126C190 123.826 187.646 121.781 183.507 120C187.646 118.219 190 116.174 190 114C190 112.027 188.061 110.16 184.607 108.5C188.061 106.84 190 104.974 190 103C190 100.826 187.646 98.7811 183.507 97.0001C187.646 95.2192 190 93.1745 190 91.0001C190 89.0266 188.061 87.1599 184.607 85.5001C188.061 83.8404 190 81.9737 190 80.0001C190 77.8258 187.646 75.7811 183.507 74.0001C187.646 72.2192 190 70.1745 190 68.0001C190 66.0266 188.061 64.1598 184.607 62.5001C188.061 60.8404 190 58.9737 190 57.0001C190 51.3253 173.966 46.5337 152 45.0078V45.7596C160.55 46.3558 168.186 47.4481 174.305 48.8913C179.071 50.0153 182.875 51.3427 185.47 52.7896C188.128 54.2719 189.25 55.7247 189.25 57.0001C189.25 58.2756 188.128 59.7284 185.47 61.2107C184.935 61.509 184.349 61.8022 183.713 62.0897C177.077 59.1784 165.691 56.9588 152 56.0078V56.7596C160.55 57.3558 168.186 58.4481 174.305 59.8913C177.616 60.6721 180.462 61.5511 182.762 62.5001C180.462 63.4492 177.616 64.3282 174.305 65.109C168.565 66.4627 161.492 67.5076 153.581 68.124C153.058 68.0834 152.531 68.0447 152 68.0078V68.9925C152.531 68.9556 153.058 68.9169 153.581 68.8763C161.492 69.4927 168.565 70.5376 174.305 71.8913C177.026 72.5331 179.434 73.2413 181.482 74.0001C179.434 74.759 177.026 75.4672 174.305 76.109C168.565 77.4627 161.492 78.5076 153.581 79.124C153.058 79.0834 152.531 79.0447 152 79.0078V79.9925C152.531 79.9556 153.058 79.9169 153.581 79.8763C161.492 80.4927 168.565 81.5376 174.305 82.8913C177.616 83.6721 180.462 84.5511 182.762 85.5001C180.462 86.4492 177.616 87.3282 174.305 88.109C168.565 89.4627 161.492 90.5076 153.581 91.124C153.058 91.0834 152.531 91.0447 152 91.0078V91.9925C152.531 91.9556 153.058 91.9169 153.581 91.8763C161.492 92.4927 168.565 93.5376 174.305 94.8913C177.026 95.5331 179.434 96.2413 181.482 97.0001C179.434 97.759 177.026 98.4672 174.305 99.109C168.565 100.463 161.492 101.508 153.581 102.124C153.058 102.083 152.531 102.045 152 102.008V102.992C152.531 102.956 153.058 102.917 153.581 102.876C161.492 103.493 168.565 104.538 174.305 105.891C177.616 106.672 180.462 107.551 182.762 108.5C180.462 109.449 177.616 110.328 174.305 111.109C168.565 112.463 161.492 113.508 153.581 114.124C153.058 114.083 152.531 114.045 152 114.008V114.992C152.531 114.956 153.058 114.917 153.581 114.876C161.492 115.493 168.565 116.538 174.305 117.891C177.026 118.533 179.434 119.241 181.482 120C179.434 120.759 177.026 121.467 174.305 122.109C168.565 123.463 161.492 124.508 153.581 125.124C153.058 125.083 152.531 125.045 152 125.008V125.992C152.531 125.956 153.058 125.917 153.581 125.876C161.492 126.493 168.565 127.538 174.305 128.891C177.616 129.672 180.462 130.551 182.762 131.5C180.462 132.449 177.616 133.328 174.305 134.109C167.91 135.617 159.859 136.742 150.839 137.318C150.501 137.659 150.101 137.939 149.658 138.141C164.389 137.29 176.702 134.986 183.713 131.911C184.349 132.198 184.935 132.491 185.47 132.79C188.128 134.272 189.25 135.725 189.25 137C189.25 138.276 188.128 139.728 185.47 141.211C182.875 142.658 179.071 143.985 174.305 145.109C164.785 147.354 151.595 148.75 137 148.75C122.405 148.75 109.216 147.354 99.6958 145.109C94.9299 143.985 91.1254 142.658 88.5305 141.211C86.8679 140.284 85.8062 139.368 85.2442 138.5H84.3779ZM157.807 68.5001C168.895 67.3828 178.04 65.3995 183.713 62.9106C184.349 63.1981 184.935 63.4913 185.47 63.7896C188.128 65.2719 189.25 66.7247 189.25 68.0001C189.25 69.2756 188.128 70.7284 185.47 72.2107C184.617 72.6865 183.633 73.1494 182.526 73.5964C176.806 71.339 168.152 69.5426 157.807 68.5001ZM182.526 74.4039C176.806 76.6613 168.152 78.4577 157.807 79.5001C168.895 80.6175 178.04 82.6008 183.713 85.0897C184.349 84.8022 184.935 84.509 185.47 84.2107C188.128 82.7284 189.25 81.2756 189.25 80.0001C189.25 78.7247 188.128 77.2719 185.47 75.7896C184.617 75.3138 183.633 74.8509 182.526 74.4039ZM157.807 91.5001C168.895 90.3828 178.04 88.3995 183.713 85.9106C184.349 86.1981 184.935 86.4913 185.47 86.7896C188.128 88.2719 189.25 89.7247 189.25 91.0001C189.25 92.2756 188.128 93.7284 185.47 95.2107C184.617 95.6865 183.633 96.1494 182.526 96.5964C176.806 94.339 168.152 92.5426 157.807 91.5001ZM182.526 97.4039C176.806 99.6613 168.152 101.458 157.807 102.5C168.895 103.617 178.04 105.601 183.713 108.09C184.349 107.802 184.935 107.509 185.47 107.211C188.128 105.728 189.25 104.276 189.25 103C189.25 101.725 188.128 100.272 185.47 98.7896C184.617 98.3138 183.633 97.8509 182.526 97.4039ZM157.807 114.5C168.895 113.383 178.04 111.399 183.713 108.911C184.349 109.198 184.935 109.491 185.47 109.79C188.128 111.272 189.25 112.725 189.25 114C189.25 115.276 188.128 116.728 185.47 118.211C184.617 118.686 183.633 119.149 182.526 119.596C176.806 117.339 168.152 115.543 157.807 114.5ZM182.526 120.404C176.806 122.661 168.152 124.458 157.807 125.5C168.895 126.617 178.04 128.601 183.713 131.09C184.349 130.802 184.935 130.509 185.47 130.211C188.128 128.728 189.25 127.276 189.25 126C189.25 124.725 188.128 123.272 185.47 121.79C184.617 121.314 183.633 120.851 182.526 120.404Z" fill="var(--Icon-Status)"/>
              <rect x="45.375" y="21.875" width="106.25" height="116.25" rx="3.625" stroke="var(--Icon-Status)" strokeWidth="0.75"/>
              <rect x="77.375" y="99.875" width="14.25" height="14.25" rx="3.625" stroke="var(--Icon-Status)" strokeWidth="0.75"/>
              <circle cx="58" cy="32.5" r="3.625" stroke="var(--Icon-Status)" strokeWidth="0.75"/>
              <circle cx="70.5" cy="32.5" r="3.625" stroke="var(--Icon-Status)" strokeWidth="0.75"/>
              <circle cx="83" cy="32.5" r="3.625" stroke="var(--Icon-Status)" strokeWidth="0.75"/>
              <line x1="45" y1="43" x2="152" y2="43" stroke="var(--Icon-Status)"/>
              <path d="M84.7518 111.689C83.9335 109.337 86.1709 107.07 88.5333 107.857L131.824 122.277C134.211 123.072 134.618 126.275 132.506 127.642L117.024 137.661C116.678 137.885 116.382 138.177 116.155 138.52L105.019 155.287C103.647 157.354 100.502 156.956 99.6868 154.613L84.7518 111.689Z" fill="var(--Icon-Status)"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M85.7307 107.53C88.0258 89.6822 107.216 65.1574 133 52.5V77C107.19 81.609 97.5238 94.7151 87.9456 107.703C87.3666 108.488 86.788 109.272 86.2061 110.054C86.31 110.682 86.4077 111.331 86.5 112C78.6717 104.501 72.7687 103.293 64.219 101.545L64 101.5V85.5C78.2268 92.1688 83.3613 96.4657 85.7307 107.53Z" fill="var(--Icon-Status)"/>
              <circle cx="87.5" cy="151" r="1.5" transform="rotate(180 87.5 151)" fill="var(--Icon-Status)"/>
              <circle cx="34" cy="74" r="1.5" transform="rotate(180 34 74)" fill="var(--Icon-Status)"/>
              <path d="M87 151L46 151C39.3726 151 34 145.627 34 139V139L34 74" stroke="var(--Icon-Status)" strokeWidth="0.75"/>
              <path d="M34 23L34 21C34 14.3726 39.3726 9 46 9V9L122 9" stroke="var(--Icon-Status)" strokeWidth="0.75"/>
              <path d="M122 9L118.25 9C113.694 9 110 5.30635 110 0.75V0.75L110 3.33818e-07" stroke="var(--Icon-Status)" strokeWidth="0.75"/>
              <path d="M122 9L118.25 9C113.694 9 110 12.6937 110 17.25V17.25L110 18" stroke="var(--Icon-Status)" strokeWidth="0.75"/>
            </svg>
            }
            </div>
            <div className={styles.StatusCashin__infoOrder}>
              <div className={styles.infoOrder__cols}>
                <h4>Order №:</h4>
                <span>
                  {props.data.id}
                  <svg onClick={event => copyOrderId(event.target)} style={{cursor: 'pointer'}} width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.28585 4.14286C6.28585 2.95939 7.24525 2 8.42871 2H18.4287C19.6122 2 20.5716 2.95939 20.5716 4.14286V17C20.5716 18.1835 19.6122 19.1429 18.4287 19.1429H17.7144V19.8571C17.7144 21.0406 16.7551 22 15.5716 22H5.57157C4.3881 22 3.42871 21.0406 3.42871 19.8571V7C3.42871 5.81653 4.3881 4.85714 5.57157 4.85714H6.28585V4.14286ZM7.71443 4.85714H15.5716C16.7551 4.85714 17.7144 5.81654 17.7144 7V17.7143H18.4287C18.8232 17.7143 19.143 17.3945 19.143 17V4.14286C19.143 3.74837 18.8232 3.42857 18.4287 3.42857H8.42871C8.03421 3.42857 7.71443 3.74837 7.71443 4.14286V4.85714ZM4.85728 7C4.85728 6.60551 5.17708 6.28571 5.57157 6.28571H15.5716C15.9661 6.28571 16.2859 6.60551 16.2859 7V19.8571C16.2859 20.2516 15.9661 20.5714 15.5716 20.5714H5.57157C5.17708 20.5714 4.85728 20.2516 4.85728 19.8571V7Z" fill="var(--Color7)"/>
                  </svg>
                </span>
              </div>
              <div className={styles.infoOrder__cols}>
                <h4>Status:</h4>
                <span>
                  {props.data.status}
                  <svg className={styles.infoOrder__update} style={{cursor: 'pointer'}} onClick={() => props.renewData()} width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18.1539 5.38281C17.814 5.38281 17.5384 5.65834 17.5384 5.99823V8.24629C14.3701 5.17886 9.31502 5.26072 6.24759 8.42904C4.80198 9.9222 3.99552 11.9202 3.99953 13.9985C3.99953 14.3384 4.27505 14.6139 4.61494 14.6139C4.95484 14.6139 5.23033 14.3384 5.23033 13.9985C5.23108 10.2598 8.26245 7.22961 12.0012 7.23037C13.8999 7.23073 15.7112 8.02853 16.9932 9.4291L14.267 10.338C13.9441 10.4455 13.7694 10.7943 13.8768 11.1171C13.9843 11.44 14.3331 11.6147 14.6559 11.5073L18.3484 10.2765C18.6004 10.1925 18.7701 9.95628 18.7693 9.69063V5.99819C18.7693 5.65834 18.4938 5.38281 18.1539 5.38281Z" fill="#666666"/>
                    <path d="M19.3844 13.3828C19.0445 13.3828 18.769 13.6583 18.769 13.9982C18.7682 17.7369 15.7368 20.7671 11.9981 20.7664C10.0994 20.766 8.28811 19.9682 7.00607 18.5676L9.73231 17.6587C10.0552 17.5513 10.2299 17.2025 10.1225 16.8796C10.015 16.5567 9.66625 16.382 9.34337 16.4894L5.65094 17.7202C5.39888 17.8042 5.22915 18.0404 5.22998 18.3061V21.9985C5.22998 22.3384 5.50551 22.6139 5.8454 22.6139C6.18529 22.6139 6.46082 22.3384 6.46082 21.9985V19.7504C9.62918 22.8179 14.6843 22.736 17.7517 19.5677C19.1973 18.0745 20.0037 16.0765 19.9997 13.9982C19.9998 13.6583 19.7243 13.3828 19.3844 13.3828Z" fill="#666666"/>
                  </svg>
                </span>
              </div>
            </div>
            <p className={styles.StatusCashin__infoDetails}>
              Follow the status on this page or check more details in your wallet
            </p>
          </div>
          <Button onClick={() => computedHandlerButton()}
          title={computedTextButton()} />
        </div>
      }
    </>
  )
}

export default StatusTransaction