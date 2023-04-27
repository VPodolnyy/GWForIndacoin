import { useRef, useState, useEffect } from "react";

export const useQuery = () => {
  const search = window.location.search;
  const result = search.slice(search.indexOf('?') + 1).split('&').reduce((params, hash) => {
    let [key, val] = hash.split('=')
    return Object.assign(params, { [key.toLowerCase()]: decodeURIComponent(val) })
  }, {})
  return result
}

export const useIsIframe = () => {
  let isFramed = false
  try { isFramed = window != window.top || document != top.document || self.location != top.location }
  catch (e) { isFramed = true }
  if (isFramed) return true
  else return false
}

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

export default useQuery