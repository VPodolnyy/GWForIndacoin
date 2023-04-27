// tools
import React, { useState, useEffect } from "react"
import styles from "./styles.sass"

import { LookupAddress } from "@edns/sdk";

// components
import { Input, InputChecked } from '@components/Base'
// request
import Request from '@requests/request'


const WalletData = (props) => {
  const networks = props.data.currencyes.crypto.find(curr => curr.id === props.data.currencyOut.id).networks
  const [activeNetwork, setActiveNetwork] = useState(networks[0] || null)
  const [addressWallet, setAddressWallet] = useState(props.data.cryptoAddress || '')
  const [errorWallet, setErrorWallet] = useState(false)
  const [checkedWallet, setCheckedWallet] = useState(false)
  const debouncedValue = useDebounce(addressWallet, 300)

  useEffect(() => {
    if (props.submit) submitWallet()
    if (props.backStep) backStep()
  }, [props.submit, props.backStep])

  useEffect(() => {
    if ((debouncedValue && !errorWallet && activeNetwork) || checkedWallet) return props.submitButton({disabled: false})
    props.submitButton({disabled: true})
  }, [debouncedValue, errorWallet, activeNetwork, checkedWallet])

  useEffect(() => {
    if (debouncedValue) {
      if (debouncedValue.indexOf('.') !== -1) ednsAddress(debouncedValue)
      else validateWallet(debouncedValue)
    }
  }, [debouncedValue])

  function submitWallet () {
    props.setSubmit(false)
    if (props.data.status === 'WaitingCashin') return props.setStep(4)
    props.submitButton({disabled: true, loading: true})
    if (checkedWallet) {
      return Request.AddressInWallet(props.data.id, props.data.hash).then(() => {
        props.submitButton({disabled: false, loading: false})
        props.renewData()
        props.setStep(4)
      })
    }
    Request.sendWallet(props.data.id, props.data.hash, debouncedValue, activeNetwork.id).then(() => {
      props.submitButton({disabled: false, loading: false})
      props.renewData()
      props.setStep(4)
    })
  }

  function backStep () {
    props.setBackStep(false)
    props.setStep(1)
  }

  async function ednsAddress (address) {
    await LookupAddress(address, props.data.currencyOut.shortName).then( walletAddress => {
      if (!walletAddress) return validateWallet(address), console.error('EDNS ' + 'Address not found')
      setAddressWallet(walletAddress)})
      .catch(err => {
        console.error('EDNS ' + err.message)
      })
  }

  const validateWallet = address => {
    const valueRegExp = activeNetwork.addressVerificationRegExp
    if (valueRegExp && RegExp(valueRegExp).test(address)) {
      setErrorWallet(false)
    } else {
      setErrorWallet(true)
    }
  }

  return (
    <div className={styles.WalletData}>
      <div className={styles.WalletData__header}>
        <svg className={styles.Wallet__img} width="168" height="119" viewBox="0 0 168 119">
          <path d="M119.52 34.6743C119.845 34.6743 120.157 34.5452 120.388 34.3155C120.618 34.0858 120.747 33.7742 120.747 33.4493V29.3704C120.746 28.3065 120.322 27.2866 119.568 26.5343C118.814 25.782 117.792 25.3588 116.726 25.3575H110.129L108.624 20.9258C108.522 20.6244 108.306 20.3745 108.023 20.2291C107.739 20.0837 107.41 20.0542 107.105 20.1467L71.3771 30.9848C71.0814 31.0925 70.8383 31.3092 70.6978 31.5903C70.5574 31.8714 70.5303 32.1956 70.6222 32.496C70.7141 32.7965 70.9179 33.0503 71.1917 33.2053C71.4654 33.3604 71.7884 33.4047 72.0939 33.3293L106.682 22.8342L109.979 32.5478C110.084 32.8555 110.307 33.1091 110.599 33.2529C110.89 33.3967 111.228 33.4189 111.536 33.3146C111.844 33.2103 112.098 32.9881 112.243 32.6968C112.387 32.4055 112.409 32.0691 112.304 31.7614L110.961 27.8049H116.728C117.592 27.8049 118.295 28.5056 118.295 29.3679V33.4493C118.292 34.1255 118.842 34.6743 119.52 34.6743Z" fill="var(--Icon-Wallet)"/>
          <path d="M129.318 53.0476C128.992 53.0476 128.68 53.1767 128.45 53.4064C128.219 53.6361 128.09 53.9477 128.09 54.2726C128.09 54.5974 128.219 54.909 128.45 55.1387C128.68 55.3684 128.992 55.4975 129.318 55.4975C130.179 55.4975 130.545 55.8625 130.545 56.7224V71.4214C130.545 72.2813 130.179 72.6464 129.318 72.6464H109.678C108.816 72.6464 108.45 72.2813 108.45 71.4214V59.1722C108.45 58.3123 108.816 57.9473 109.678 57.9473H124.408C124.733 57.9473 125.045 57.8183 125.275 57.5885C125.506 57.3588 125.635 57.0473 125.635 56.7224V42.0233C125.635 39.7915 124.189 38.3486 121.953 38.3486H47.075C44.048 38.3486 42.165 36.4695 42.165 33.4489C42.165 30.4282 44.048 28.5492 47.075 28.5492H59.5366L52.1078 30.9942C51.9491 31.0398 51.8013 31.1169 51.6733 31.2209C51.5452 31.3249 51.4394 31.4536 51.3624 31.5993C51.2853 31.745 51.2385 31.9047 51.2247 32.0689C51.2109 32.233 51.2304 32.3983 51.2822 32.5548C51.3339 32.7113 51.4167 32.8557 51.5257 32.9795C51.6346 33.1033 51.7675 33.2038 51.9163 33.2752C52.0651 33.3466 52.2268 33.3872 52.3918 33.3947C52.5567 33.4023 52.7215 33.3765 52.8762 33.319L97.3583 18.6861C97.5115 18.6356 97.6531 18.5555 97.7752 18.4504C97.8973 18.3452 97.9975 18.2171 98.07 18.0733C98.1425 17.9296 98.1859 17.773 98.1977 17.6124C98.2096 17.4519 98.1896 17.2907 98.139 17.1378C98.0884 16.985 98.0081 16.8437 97.9027 16.7218C97.7974 16.5999 97.669 16.5 97.5249 16.4277C97.3808 16.3553 97.2239 16.312 97.063 16.3002C96.9022 16.2884 96.7406 16.3083 96.5874 16.3588L66.882 26.1337C66.8255 26.1239 66.7739 26.0994 66.715 26.0994H47.075C42.6708 26.0994 39.71 29.0539 39.71 33.4489V87.3454C39.71 91.7404 42.6708 94.6949 47.075 94.6949H121.953C124.189 94.6949 125.635 93.252 125.635 91.0202V78.771C125.635 78.4461 125.506 78.1345 125.275 77.9048C125.045 77.6751 124.733 77.5461 124.408 77.5461C124.082 77.5461 123.77 77.6751 123.54 77.9048C123.309 78.1345 123.18 78.4461 123.18 78.771V91.0202C123.18 91.8801 122.814 92.2451 121.953 92.2451H47.075C44.048 92.2451 42.165 90.3661 42.165 87.3454V39.1129C43.4244 40.1737 45.0914 40.7984 47.075 40.7984H121.953C122.814 40.7984 123.18 41.1634 123.18 42.0233V55.4975H109.678C107.441 55.4975 105.995 56.9404 105.995 59.1722V71.4214C105.995 73.6533 107.441 75.0962 109.678 75.0962H129.318C131.554 75.0962 133 73.6533 133 71.4214V56.7224C133 54.4906 131.554 53.0476 129.318 53.0476Z" fill="var(--Icon-Wallet)"/>
          <path d="M118.27 67.7473C119.626 67.7473 120.725 66.6505 120.725 65.2975C120.725 63.9445 119.626 62.8477 118.27 62.8477C116.914 62.8477 115.815 63.9445 115.815 65.2975C115.815 66.6505 116.914 67.7473 118.27 67.7473Z" fill="var(--Icon-Wallet)"/>
          <path d="M6.00003 18C5.17166 22.5 4.49996 23.1716 0 24C4.49996 24.8284 5.17166 25.5001 6.00003 30C6.8284 25.5001 7.50009 24.8284 12 24C7.49998 23.1716 6.82845 22.5 6.00003 18Z" fill="var(--Icon-Wallet)"/>
          <path d="M154 107C153.172 111.5 152.5 112.172 148 113C152.5 113.828 153.172 114.5 154 119C154.828 114.5 155.5 113.828 160 113C155.5 112.172 154.828 111.5 154 107Z" fill="var(--Icon-Wallet)"/>
          <path d="M161.5 30C160.603 34.875 159.875 35.6026 155 36.5C159.875 37.3975 160.603 38.1251 161.5 43C162.397 38.1251 163.125 37.3974 168 36.5C163.125 35.6026 162.397 34.875 161.5 30Z" fill="var(--Icon-Wallet)"/>
          <path d="M21 1C20.3097 4.75 19.75 5.3097 16 6C19.75 6.69035 20.3097 7.25005 21 11C21.6903 7.25005 22.2501 6.6903 26 6C22.25 5.3097 21.6904 4.75 21 1Z" fill="var(--Icon-Wallet)"/>
          <path d="M134 0C133.31 3.75 132.75 4.3097 129 5C132.75 5.6904 133.31 6.25 134 10C134.69 6.25 135.25 5.6903 139 5C135.25 4.3097 134.69 3.75 134 0Z" fill="var(--Icon-Wallet)"/>
        </svg>
        <h3>What’s your crypto wallet address?</h3>
      </div>
      <Input
        label={`${props.data.partnerId === '82' ? 'FIO Crypto Handle' : 'Your crypto wallet address or domain name'}`}
        error={errorWallet}
        value={addressWallet}
        disabled={props.data.cryptoAddress ? true : false}
        required={'required'}
        onClick={() => setCheckedWallet(false)}
        onChange={value => setAddressWallet(value)}
        onBlur={value => {
          // if(!value) setCheckedWallet(true)
          setAddressWallet(value)
        }}
      />
      {
        props.data.currencyOut.shortName === 'CPC' &&
        <a className={styles.cpcWallet} target='_blank' href="https://howto.cpcoin.io/smartwallet">Create CPC Smart Wallet Now</a>
      }
      <div className={styles.WalletData__Networks}>
        <span>Check the network</span>
        <ul className={styles.networksList}>
          {
            (networks.map(network =>
              <li key={network.shortName}
                onClick={() => setActiveNetwork(network)}
                className={`${activeNetwork.shortName === network.shortName && styles.networkActive}`}
              >{network.shortName}</li>
            ))
          }
        </ul>
      </div>
      {/* <div className={styles.WalletData__SkipAddress}>
        <span>or</span>
        <InputChecked
          checked={checkedWallet}
          error={null}
          onChange={() => setCheckedWallet(!checkedWallet)}>
            Skip and create wallet here
        </InputChecked>
      </div> */}
    </div>
  );
}

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect( () => {
      const handler = setTimeout(() => { setDebouncedValue(value) }, delay);
      return () => { clearTimeout(handler) }
  }, [value])
  return debouncedValue;
}

export default WalletData