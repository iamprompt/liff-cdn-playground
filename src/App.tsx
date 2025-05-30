import { useLIFF } from './lib/liff/context'
import { useVConsole } from './components/VConsole'
import { useMemo } from 'react'
import { Button } from './components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar'
import { LIFFCapabilities } from './lib/liff/constants'
import { SDKVersionSelector } from './components/SDKVersionSelector'
import { Badge } from './components/ui/badge'

function App() {
  const {
    isReady,
    login,
    logout,
    isLoggedIn,
    profile,
    decodedIDToken,
    context,
    isInClient,
    os,
    capabilities,
    sdkVersion,
  } = useLIFF()

  useVConsole()

  const details = useMemo(() => {
    return [
      {
        key: 'displayName',
        label: 'Display Name',
        value: profile?.displayName || 'N/A',
      },
      {
        key: 'userId',
        label: 'User ID',
        value: profile?.userId || 'N/A',
      },
      {
        key: 'pictureUrl',
        label: 'Picture URL',
        value: profile?.pictureUrl || 'N/A',
      },
      {
        key: 'statusMessage',
        label: 'Status Message',
        value: profile?.statusMessage || 'N/A',
      },
      {
        key: 'email',
        label: 'Email',
        value: decodedIDToken?.email || 'N/A',
      },
      {
        key: 'canSendMessage',
        label: 'Can Send Message',
        value: capabilities.includes(LIFFCapabilities.SEND_MESSAGE)
          ? 'Yes'
          : 'No',
      },
      {
        key: 'isInClient',
        label: 'Is In Client',
        value: isInClient ? 'Yes' : 'No',
      },
      {
        key: 'liffId',
        label: 'LIFF ID',
        value: context?.liffId || 'N/A',
      },
      {
        key: 'viewType',
        label: 'View Type',
        value: context?.viewType || 'N/A',
      },
      {
        key: 'sdkVersion',
        label: 'SDK Version',
        value: window.liff?.getVersion() || 'N/A',
      },
      {
        key: 'canUseShareTargetPicker',
        label: 'Can Use Share Target Picker',
        value: capabilities.includes(LIFFCapabilities.SHARE_TARGET_PICKER)
          ? 'Yes'
          : 'No',
      },
      {
        key: 'os',
        label: 'OS',
        value: os || 'N/A',
      },
      {
        key: 'appLanguage',
        label: 'App Language',
        value: window.liff?.getAppLanguage?.() || 'N/A',
      },
      {
        key: 'lineVersion',
        label: 'LINE Version',
        value: window.liff?.getLineVersion?.() || 'N/A',
      },
      {
        key: 'isMiniApp',
        label: 'Is Mini App',
        value: context?.miniDomainAllowed ? 'Yes' : 'No',
      },
    ]
  }, [profile, decodedIDToken, context, isInClient, os, capabilities])

  return (
    <div className="p-4 pb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">LIFF Playground</h1>
          <Badge>{`v${sdkVersion.version}${sdkVersion.patch ? ' (Patch)' : ''}`}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <SDKVersionSelector />
          {isReady && !isInClient ? (
            <>
              <Button
                variant="default"
                onClick={() => login()}
                disabled={isLoggedIn || !isReady}
              >
                Login
              </Button>
              <Button
                variant="outline"
                onClick={() => logout()}
                disabled={!isLoggedIn || !isReady}
              >
                Logout
              </Button>
            </>
          ) : null}
        </div>
      </div>
      <div className="my-4">
        <Avatar className="size-48 mx-auto">
          <AvatarImage
            src={profile?.pictureUrl}
            alt={profile?.displayName || 'User Avatar'}
            draggable={false}
          />
          <AvatarFallback className="bg-gray-200 text-gray-600">
            <img
              src="/images/default-avatar.webp"
              alt={profile?.displayName || 'Default Avatar'}
            />
          </AvatarFallback>
        </Avatar>
      </div>
      <ul className="divide-dashed divide-y divide-gray-200">
        {details.map((detail) => (
          <li key={detail.key} className="break-all py-1">
            <strong>{detail.label}:</strong> {detail.value}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
