import { useEffect } from 'react'
import VConsole from 'vconsole'

export const useVConsole = () => {
  useEffect(() => {
    const vConsole = new VConsole()

    return () => {
      vConsole.destroy()
    }
  }, [])
}
