import { parseAsBoolean, useQueryState } from 'nuqs'
import { useEffect } from 'react'
import VConsole from 'vconsole'

export const useVConsole = () => {
  const [isVConsoleEnabled] = useQueryState(
    'vconsole',
    parseAsBoolean.withDefault(false),
  )

  useEffect(() => {
    if (!isVConsoleEnabled) {
      return
    }

    const vConsole = new VConsole()

    return () => {
      if (vConsole) {
        console.log('Destroying vConsole instance...')
        vConsole.destroy()
      }
    }
  }, [isVConsoleEnabled])
}
