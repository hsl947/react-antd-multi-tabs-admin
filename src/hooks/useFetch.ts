import { useEffect, useReducer } from 'react'

function dataReducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true }
    case 'response':
      return { ...state, loading: false, data: action.data }
    case 'error':
      return { ...state, loading: false, error: action.error }
    default:
      return state
  }
}

/**
 * Custom React hook around `window.fetch` to encapsulate loading, error,
 * and data states. Feel free to replace this with your request issuing client
 * (i.e. axios, react-query, Apollo).
 */
export function useFetch(url, options = {}) {
  const [{ loading, error, data }, dispatch] = useReducer(dataReducer, {
    data: null,
    loading: false,
    error: null
  })

  // Serialize the "fetch" options so it may become
  // a dependency to the "useEffect" below.
  const serializedOptions = JSON.stringify(options)

  useEffect(() => {
    dispatch({ type: 'loading' })

    fetch(url, JSON.parse(serializedOptions))
      .then((res) => {
        console.log(res.status, res.statusText)
        return res.json()
      })
      .then((data) => dispatch({ type: 'response', data }))
      .catch((error) => dispatch({ type: 'error', error }))
  }, [url, serializedOptions])

  return { loading, error, data }
}
