import { Fragment } from 'react/jsx-runtime'
import { Button } from '../ui/button'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { useLIFF } from '@/lib/liff/context'
import { LIFFCapabilities } from '@/lib/liff/constants'

export const SendMessageButton = () => {
  const { capabilities } = useLIFF()

  const sendMessages = useCallback(async () => {
    try {
      if (!capabilities.includes(LIFFCapabilities.SEND_MESSAGE)) {
        toast.error('This action is not supported in the current context.')
        return
      }

      await window.liff.sendMessages([
        {
          type: 'text',
          text: 'Hello from LIFF!',
        },
      ])

      console.log('Messages sent successfully.')
      toast.success('Messages sent successfully.')
    } catch (error) {
      console.error('Error sending messages:', error)
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}, Please try again.`)
      } else {
        toast.error('Failed to send messages. Please try again.')
      }
    }
  }, [capabilities])

  return (
    <Fragment>
      <Button size="sm" onClick={sendMessages}>
        Send
      </Button>
    </Fragment>
  )
}
