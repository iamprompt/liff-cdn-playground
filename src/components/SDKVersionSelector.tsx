import { useLIFF } from '@/lib/liff/context'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { LIFF_SDK_VERSIONS } from '@/lib/liff/constants'
import { useState } from 'react'
import { Switch } from './ui/switch'
import { Label } from './ui/label'

export const SDKVersionSelector = () => {
  const { setSdkVersion, sdkVersion } = useLIFF()
  const [version, setVersion] = useState(sdkVersion.version)
  const [isPatch, setIsPatch] = useState(sdkVersion.patch)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Change SDK</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left">Change SDK Version</DialogTitle>
          <DialogDescription className="text-left">
            Select the version of the LIFF SDK to use. The latest version is
            recommended for new features and improvements.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <Select
            value={version}
            onValueChange={(value) => {
              setVersion(value)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select SDK Version" />
            </SelectTrigger>
            <SelectContent>
              {LIFF_SDK_VERSIONS.map((versionGroup) => (
                <SelectGroup key={versionGroup.type}>
                  <SelectLabel className="font-bold">
                    {versionGroup.label}
                  </SelectLabel>
                  {versionGroup.versions.map((version) => (
                    <SelectItem key={version.version} value={version.version}>
                      {version.version}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Switch
              id="patch"
              checked={isPatch}
              onCheckedChange={(checked) => {
                setIsPatch(checked)
              }}
            />
            <Label htmlFor="patch">Patch</Label>
          </div>
        </div>
        <DialogFooter className="flex sm:justify-between mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={async () => {
              await setSdkVersion(version, isPatch)
            }}
            disabled={!version}
          >
            Set SDK Version
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
