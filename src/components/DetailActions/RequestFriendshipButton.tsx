import { Fragment } from 'react/jsx-runtime'
import { Button } from '../ui/button'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { useLIFF } from '@/lib/liff/context'
import { LIFFCapabilities } from '@/lib/liff/constants'

export const RequestFriendshipButton = () => {
  const { refetchFriendship, capabilities } = useLIFF()

  const requestFriendship = useCallback(async () => {
    try {
      if (!capabilities.includes(LIFFCapabilities.REQUEST_FRIENDSHIP)) {
        toast.error('This action is not supported in the current context.')
        return
      }

      await window.liff.requestFriendship()

      console.log('Friendship requested successfully.')
      toast.success('Friendship requested successfully.')

      await refetchFriendship()
    } catch (error) {
      console.error('Error requesting friendship:', error)
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}, Please try again.`)
      } else {
        toast.error('Failed to send messages. Please try again.')
      }
    }
  }, [refetchFriendship, capabilities])

  return (
    <Fragment>
      <Button size="sm" onClick={requestFriendship}>
        Request Friendship
      </Button>
    </Fragment>
  )
}
