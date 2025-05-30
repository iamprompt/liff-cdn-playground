import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'
import { toast } from 'sonner'

export const SDKLinkShareButton = () => {
  const [open, setOpen] = useState(false)
  const [link, setLink] = useState('')

  const generateLink = async () => {
    try {
      const permanentLink = await window.liff?.permanentLink.createUrlBy(
        window.location.href,
      )
      if (permanentLink) {
        setLink(permanentLink)
      } else {
        setLink('Error generating link')
      }
    } catch (error) {
      console.error('Error generating permanent link:', error)
      setLink('Error generating link')
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(link)
      console.log('Link copied to clipboard:', link)
      toast.success('Link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy link:', error)
      toast.error('Failed to copy link. Please try again.')
    }
  }

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={async (isOpen) => {
          console.log('Dialog open state changed:', isOpen)

          if (isOpen) {
            await generateLink()
            setOpen(isOpen)
          } else {
            setOpen(isOpen)
            setLink('')
          }
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline">Share</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-left">
              Share Playground with selected SDK
            </DialogTitle>
            <DialogDescription className="text-left">
              Share the current LIFF Playground link with the selected SDK
              version. This will open the LIFF app in the LINE app with the
              specified SDK version.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <Input value={link} readOnly />
          </div>
          <DialogFooter>
            <Button onClick={handleCopyLink}>Copy Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
