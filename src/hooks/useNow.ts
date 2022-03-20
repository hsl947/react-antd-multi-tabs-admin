import { useEffect, useState } from 'react'

export const useTime = (
  getTime = () => new Date().getHours(),
  refreshCycle = 60000
) => {
  // Returns the current time
  // and queues re-renders every `refreshCycle` milliseconds (default: 100ms)

  const [now, setNow] = useState(getTime())

  useEffect(() => {
    // Regularly set time in state
    // (this will cause your component to re-render frequently)
    const intervalId = setInterval(() => setNow(getTime()), refreshCycle)

    // Cleanup interval
    return () => clearInterval(intervalId)

    // Specify dependencies for useEffect
  }, [refreshCycle, getTime])
  return now
}
