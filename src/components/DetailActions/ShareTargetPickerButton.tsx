import { Fragment } from 'react/jsx-runtime'
import { Button } from '../ui/button'
import { useCallback } from 'react'
import { useLIFF } from '@/lib/liff/context'
import { LIFFCapabilities } from '@/lib/liff/constants'
import { toast } from 'sonner'

export const ShareTargetPickerButton = () => {
  const { capabilities } = useLIFF()

  const handleShare = useCallback(async () => {
    if (!capabilities.includes(LIFFCapabilities.SHARE_TARGET_PICKER)) {
      console.error('Share Target Picker capability is not available.')
      return
    }

    try {
      const response = await window.liff.shareTargetPicker([
        {
          type: 'text',
          text: 'Hello from LIFF Share Target Picker!',
        },
      ])
      toast.success('Shared successfully!')
    } catch (error) {
      console.error('Error sharing via Share Target Picker:', error)
      if (error instanceof Error) {
        console.error(`Error: ${error.message}, Please try again.`)
        toast.error(`Error: ${error.message}, Please try again.`)
      } else {
        console.error('Failed to share. Please try again.')
        toast.error('Failed to share. Please try again.')
      }
    }
  }, [capabilities])

  return (
    <Fragment>
      <Button size="sm" onClick={handleShare}>
        Share
      </Button>
    </Fragment>
  )
}
