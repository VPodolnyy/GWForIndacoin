import React, { useState, useEffect }   from "react"
import styles                           from "./styles.sass"

// components
import { Button }                       from '@components/Base'
import { Modal }                        from "@components/Modal"

// web3
import Web3                             from "web3"
import Web3Modal                        from "web3modal"
import { useClipboard }                 from 'use-clipboard-copy'


const MetaMask = props => {

  const [isConnectMM, setIsConnectMM] = useState(false)
  const [addressWalletMM, setAddressWalletMM] = useState('')
  const [shortAddressWallet, setShortAddressWallet] = useState(null)
  const [infoWallet, setInfoWallet] = useState(false)
  const [noWeb3, setNoWeb3] = useState(false)
  const clipboard = useClipboard()

  useEffect(() => {
    const truncate = function (fullStr, strLen, separator) {
        if (fullStr.length <= strLen) return fullStr
        separator = separator || '...'
        const sepLen = separator.length,
            charsToShow = strLen - sepLen,
            frontChars = Math.ceil(charsToShow/2),
            backChars = Math.floor(charsToShow/2)
        return fullStr.substr(0, frontChars) + 
               separator + fullStr.substr(fullStr.length - backChars)
    }
    setShortAddressWallet(truncate(addressWalletMM, 12))
  }, [isConnectMM])

  // Получение и обработка адреса кошелька при подключении к метамаск
  useEffect(() => {if (isConnectMM) setShortAddressWallet(web3Truncate(addressWalletMM, 12)) }, [isConnectMM])

  const web3Truncate = (fullStr, strLen, separator) => {
    if (fullStr.length <= strLen) return fullStr
    separator = separator || '...'
    const sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow/2),
        backChars = Math.floor(charsToShow/2)
    return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars)
  }

  async function connectMM () {
    if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
      try {
          const providerOptions = {}
          const web3Modal = new Web3Modal({ network: "mainnet", cacheProvider: true, providerOptions })
          const provider = await web3Modal.connect()
          const web3 = new Web3(provider)
          const accounts = await web3.eth.getAccounts()
          setAddressWalletMM(accounts[0])
          props.validateWallet(accounts[0])
          setIsConnectMM(true)

          removeWeb3Modal()
      } catch (error) {
        removeWeb3Modal()
        props.setError(error)
      }
    } else {
      window.location.href =
        "https://metamask.app.link/dapp/pancakeswap.finance/";
    }
  }

  function disconnectMM ()  { setAddressWalletMM(""), setIsConnectMM(false) }

  function removeWeb3Modal () {
    const elem = document.getElementById('WEB3_CONNECT_MODAL_ID')
    elem.parentNode.removeChild(elem)
  }

  return (



    <>
      <div className={styles.connectBox}>
        <Button
          type={'button'}
          onClick={ isConnectMM ? disconnectMM : () => connectMM()}
          className={'text'}
          title={isConnectMM ? 'Disconnect wallet' : 'Connect wallet'}/>
      </div>

      { isConnectMM && 
        <div className={styles.walletBlock} onClick={ () => { setInfoWallet(!infoWallet) }}>
        <div className={styles.infoWallet} style={infoWallet ? {borderRadius: "13px 13px 0px 0px"} : {borderRadius: 13}}>
            <div style={{display: "flex", marginRight: 20}}>
                <img src={require(`@assets/images/icons/metamask.svg`).default}/>
                <p>My Wallet</p>
                <img className={`${styles.arrow} ${infoWallet ? styles.active : ''}`} src={require(`@assets/images/icons/arrow.svg`).default}/>
            </div>
            <p className={styles.shortWallet}>{shortAddressWallet}</p>
        </div>
        { infoWallet &&
        <>
            <div className={styles.infoWallet} onClick={() => { clipboard.copy(addressWalletMM) }}>
                <img src={require(`@assets/images/icons/copy.svg`).default}/>
                <p>Copy</p>
            </div>
            <div className={styles.infoWallet} onClick={disconnectMM} style={infoWallet ? {borderRadius: "0px 0px 13px 13px"} : {borderRadius: 13}}>
                <img src={require(`@assets/images/icons/exit.svg`).default}/>
                <p>Log out</p>
            </div>
        </>
        }
      </div>
      }





      {
        noWeb3 &&
        <Modal setToggleModal = {() => setNoWeb3(false)} style={ styles.helpWeb3 }>
            <div>
                <svg width="16" height="16" viewBox="0 0 16 16">
                    <path d="M9.87818 7.99886L15.606 2.28357C15.8568 2.03271 15.9977 1.69246 15.9977 1.33769C15.9977 0.98291 15.8568 0.642664 15.606 0.391799C15.3552 0.140934 15.015 0 14.6602 0C14.3055 0 13.9653 0.140934 13.7145 0.391799L8 6.12041L2.28552 0.391799C2.03469 0.140934 1.6945 -2.64329e-09 1.33977 0C0.985044 2.64329e-09 0.644846 0.140934 0.394017 0.391799C0.143188 0.642664 0.00227327 0.98291 0.00227327 1.33769C0.00227327 1.69246 0.143188 2.03271 0.394017 2.28357L6.12182 7.99886L0.394017 13.7142C0.269166 13.838 0.17007 13.9853 0.102444 14.1477C0.0348177 14.31 0 14.4842 0 14.66C0 14.8359 0.0348177 15.01 0.102444 15.1724C0.17007 15.3347 0.269166 15.4821 0.394017 15.6059C0.517848 15.7308 0.665174 15.8299 0.827496 15.8975C0.989818 15.9652 1.16392 16 1.33977 16C1.51562 16 1.68972 15.9652 1.85204 15.8975C2.01437 15.8299 2.16169 15.7308 2.28552 15.6059L8 9.87731L13.7145 15.6059C13.8383 15.7308 13.9856 15.8299 14.148 15.8975C14.3103 15.9652 14.4844 16 14.6602 16C14.8361 16 15.0102 15.9652 15.1725 15.8975C15.3348 15.8299 15.4822 15.7308 15.606 15.6059C15.7308 15.4821 15.8299 15.3347 15.8976 15.1724C15.9652 15.01 16 14.8359 16 14.66C16 14.4842 15.9652 14.31 15.8976 14.1477C15.8299 13.9853 15.7308 13.838 15.606 13.7142L9.87818 7.99886Z" fill="black"/>
                </svg>
                <span>Haven’t got a crypto<br />wallet yet?</span>
                <a href='https://metamask.io/download/' target='_blank'>Learn how to connect</a>
            </div>
        </Modal>
      }
    </>
  )
}

export default MetaMask



// {/* MM */}
// { isConnectMM ? 
//   <div className={styles.connectBox}>
//       <Button type={'button'} onClick={ disconnectMM } className={'text'} title={'Disconnect wallet'}/>
//   </div>
//   :
//   <div className={styles.connectBox}>
//       <Button type={'button'} onClick={ () => connectMM() } className={'text'} title={'Connect wallet'}/>
//   </div>
//   }
//   {/*  */}

//               {/* MM */}

// {isConnectMM && 
//   <div className={styles.walletBlock} onClick={ () => { setInfoWallet(!infoWallet) }}>
//   <div className={styles.infoWallet} style={infoWallet ? {borderRadius: "13px 13px 0px 0px"} : {borderRadius: 13}}>
//       <div style={{display: "flex", marginRight: 20}}>
//           <img src={require(`@assets/images/icons/metamask.svg`).default}/>
//           <p>My Wallet</p>
//           <img className={`${styles.arrow} ${infoWallet ? styles.active : ''}`} src={require(`@assets/images/icons/arrow.svg`).default}/>
//       </div>
//       <p className={styles.shortWallet}>{shortAddressWallet}</p>
//   </div>
//   {infoWallet &&
//   <>
//       <div className={styles.infoWallet} onClick={() => { clipboard.copy(addressWalletMM) }}>
//           <img src={require(`@assets/images/icons/copy.svg`).default}/>
//           <p>Copy</p>
//       </div>
//       <div className={styles.infoWallet} onClick={disconnectMM} style={infoWallet ? {borderRadius: "0px 0px 13px 13px"} : {borderRadius: 13}}>
//           <img src={require(`@assets/images/icons/exit.svg`).default}/>
//           <p>Log out</p>
//       </div>
//   </>
//   }
// </div>
// }



// {
//   noWeb3 &&
//   <Modal setToggleModal = {() => setNoWeb3(false)} style={ styles.helpWeb3 }>
//       <div>
//           <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M9.87818 7.99886L15.606 2.28357C15.8568 2.03271 15.9977 1.69246 15.9977 1.33769C15.9977 0.98291 15.8568 0.642664 15.606 0.391799C15.3552 0.140934 15.015 0 14.6602 0C14.3055 0 13.9653 0.140934 13.7145 0.391799L8 6.12041L2.28552 0.391799C2.03469 0.140934 1.6945 -2.64329e-09 1.33977 0C0.985044 2.64329e-09 0.644846 0.140934 0.394017 0.391799C0.143188 0.642664 0.00227327 0.98291 0.00227327 1.33769C0.00227327 1.69246 0.143188 2.03271 0.394017 2.28357L6.12182 7.99886L0.394017 13.7142C0.269166 13.838 0.17007 13.9853 0.102444 14.1477C0.0348177 14.31 0 14.4842 0 14.66C0 14.8359 0.0348177 15.01 0.102444 15.1724C0.17007 15.3347 0.269166 15.4821 0.394017 15.6059C0.517848 15.7308 0.665174 15.8299 0.827496 15.8975C0.989818 15.9652 1.16392 16 1.33977 16C1.51562 16 1.68972 15.9652 1.85204 15.8975C2.01437 15.8299 2.16169 15.7308 2.28552 15.6059L8 9.87731L13.7145 15.6059C13.8383 15.7308 13.9856 15.8299 14.148 15.8975C14.3103 15.9652 14.4844 16 14.6602 16C14.8361 16 15.0102 15.9652 15.1725 15.8975C15.3348 15.8299 15.4822 15.7308 15.606 15.6059C15.7308 15.4821 15.8299 15.3347 15.8976 15.1724C15.9652 15.01 16 14.8359 16 14.66C16 14.4842 15.9652 14.31 15.8976 14.1477C15.8299 13.9853 15.7308 13.838 15.606 13.7142L9.87818 7.99886Z" fill="black"/>
//           </svg>
//           <span>Haven’t got a crypto<br />wallet yet?</span>
//           <a href='https://metamask.io/download/' target='_blank'>Learn how to connect</a>
//       </div>
//   </Modal>
// }
// {/* MM */}