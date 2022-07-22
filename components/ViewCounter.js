import { useEffect } from 'react'
import useSWR from 'swr'
import fetcher from 'lib/fetcher'

const setViewed = (slugKey) => {
  const key = `viewed:${slugKey}`
  const viewed = !!sessionStorage.getItem(key)
  if (viewed) return false

  sessionStorage.setItem(key, true)
  return true
}

export default function ViewCounter({ slug, className }) {
  let slugKey = slug.replace(/\//g, '-')
  let { data } = useSWR(`/api/views/${slugKey}`, fetcher)
  let views = new Number(data?.total)

  useEffect(() => {
    let registerView = () =>
      fetch(`/api/views/${slugKey}`, {
        method: 'POST',
      })

    setViewed(slugKey) && registerView()
  }, [slugKey])

  return <span className={className}>{`${views > 0 ? views.toLocaleString() : '–––'} views`}</span>
}
