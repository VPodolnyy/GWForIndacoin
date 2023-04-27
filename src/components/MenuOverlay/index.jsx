import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.sass";
import { Input } from '@components/Base'

const MenuOverlay = (props) => {
  const [value, setValue] = useState(undefined)
  const [search, setSearch] = useState('')
  const outItems = props.items || [];
  const { ref, isShow, setIsShow } = useOutsideAlerter(false)

  useEffect(() => {
    if (props.value) setValue(props.value)
  }, [props]);

  useEffect(() => { isShow ? setSearch('') : null }, [isShow])

  function selected(index) {
    const values = outItems.find((item) => item.id === index);
    if (values) { setValue(values.name), props.selected(values.name) }
  }

  // Вывод элементов массива после поиска
  function itemsMenu() {
    return outItems.filter(item => {
      if (item.longName) return item.longName.toLowerCase().includes(search.toLowerCase())
      return item.name.toLowerCase().includes(search.toLowerCase())
    })
  }

  function getListCurImg(cur) {
    const imgId = outItems.find((item) => item.name === cur)
    if (typeof imgId?.id === 'number') {
      try { return `https://gw.indacoin.io/api/v1/Data/Currencies/${imgId.id}/Icon` }
      catch (err) { return null }
    } else {
      try { return require(`../../assets/images/images-menu/${cur.toLowerCase()}.png`).default }
      catch (err) { return null }
    }
  }

  return (
    <div className={props.className} >
      <div className={`${styles.dropMenu} ${props.dropMenuStyle} ${props.disabled ? styles.disabled : ''}`} onClick={() => { setIsShow(!isShow) }}>
        {getListCurImg(value) != null && !props.children && <img width={24} height={24} src={getListCurImg(value)} />}
        {props.children}
        {value && !props.children && <span>{value}</span>}
        {!props.disabled &&
          <svg width="10" height="6" viewBox="0 0 10 6" className={styles.arrow}>
            <path d="M5 5L4.46967 5.53033C4.76256 5.82322 5.23744 5.82322 5.53033 5.53033L5 5ZM1.53033 0.46967C1.23744 0.176777 0.762563 0.176777 0.46967 0.46967C0.176777 0.762563 0.176777 1.23744 0.46967 1.53033L1.53033 0.46967ZM9.53033 1.53033C9.82322 1.23744 9.82322 0.762563 9.53033 0.46967C9.23744 0.176777 8.76256 0.176777 8.46967 0.46967L9.53033 1.53033ZM5.53033 4.46967L1.53033 0.46967L0.46967 1.53033L4.46967 5.53033L5.53033 4.46967ZM8.46967 0.46967L4.46967 4.46967L5.53033 5.53033L9.53033 1.53033L8.46967 0.46967Z" fill="var(--TextDropdown)" />
          </svg>
        }
      </div>
      {
        !props.disabled && isShow &&
        <div className={styles.blackBack}>
          <div className={styles.dropdown} ref={ref}>
            <div className={styles.searchBox}>
              <span className={styles.labelMenu}>{props.labelMenu}</span>
              <Input
                type={'search'}
                label={'Search'}
                value={search}
                onChange={(value) => setSearch(value)}
                onBlur={(value) => setSearch(value)}
                autoFocus={true}
              />
            </div>
            <menu>
              {
                itemsMenu().map(item => {
                  return (
                    <li
                      key={item.id}
                      onClick={() => {
                        selected(item.id);
                        setSearch('')
                        setIsShow(!isShow);
                      }}
                    >
                      {getListCurImg(item.name)
                        && <img className={styles.iconImg} width={22} height={22} src={getListCurImg(item.name)} />}
                      <div className={styles.textBox}>
                        <span>{item.name}</span>
                        <p>{item.longName ? item.longName : null}</p>
                      </div>
                    </li>
                  );
                })
              }
            </menu>
          </div>
        </div>
      }
    </div>
  )
}

// Отслеживаение клика вне области
export const useOutsideAlerter = (initialIsVisible) => {
  const [isShow, setIsShow] = useState(initialIsVisible)
  const ref = useRef(null)
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) { setIsShow(false) }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => document.removeEventListener('click', handleClickOutside, true)
  });
  return { ref, isShow, setIsShow }
}

export default MenuOverlay;