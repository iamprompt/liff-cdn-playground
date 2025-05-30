import {
  parseAsBoolean,
  parseAsString,
  useQueryState,
  useQueryStates,
} from 'nuqs'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { Context, DecodedIDToken, OS, Profile } from './types'
import { LIFFCapabilities, LIFFSdkVersionType } from './constants'
import { isApiAvailable } from './utils'

type LIFFContextType = {
  isReady: boolean
  login: typeof window.liff.login
  logout: typeof window.liff.logout
  isLoggedIn: boolean
  isSdkLoaded: boolean
  sdkVersion: { version: string; patch: boolean; type: LIFFSdkVersionType }
  setSdkVersion: (version: string, patch: boolean) => void
  profile: Profile | null
  decodedIDToken: DecodedIDToken | null
  context: Context
  isInClient: boolean
  os: OS
  capabilities: LIFFCapabilities[]
}

const DefaultLIFFContext: LIFFContextType = {
  isReady: false,
  isLoggedIn: false,
  login: () => {
    throw new Error('This function is not implemented yet.')
  },
  logout: () => {
    throw new Error('This function is not implemented yet.')
  },
  isSdkLoaded: false,
  setSdkVersion: (version: string, patch: boolean) => {
    throw new Error('This function is not implemented yet.')
  },
  profile: null,
  decodedIDToken: null,
  context: null,
  isInClient: false,
  os: undefined,
  sdkVersion: { version: '2', patch: true, type: LIFFSdkVersionType.EDGE },
  capabilities: [],
}

export const LIFFContext = createContext<LIFFContextType>(DefaultLIFFContext)

export const useLIFF = () => {
  const context = useContext(LIFFContext)
  if (!context) {
    throw new Error('useLIFF must be used within a LIFFProvider')
  }
  return context
}

export const useLIFFContext = (): LIFFContextType => {
  const isInit = useRef(false)
  const [isSdkLoaded, setIsSdkLoaded] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [decodedIDToken, setDecodedIDToken] = useState<DecodedIDToken>(null)
  const [context, setContext] = useState<Context>(null)

  const [isInClient, setIsInClient] = useState(false)
  const [os, setOS] = useState<OS>(undefined)
  const [capabilities, setCapabilities] = useState<LIFFCapabilities[]>([])

  const [versionType, setVersionType] = useState<LIFFSdkVersionType>(
    LIFFSdkVersionType.EDGE,
  )
  const [query, setQuery] = useQueryStates({
    version: parseAsString.withDefault('2'),
    patch: parseAsBoolean.withDefault(true),
  })

  const [customLiffId] = useQueryState(
    'liffId',
    parseAsString.withDefault(import.meta.env.LINE_LIFF_ID || ''),
  )

  const loadSdk = useCallback((version: string, patch?: boolean) => {
    const isCdnEdgeVersion = /^\d+$/.test(version)
    const isCdnFixedVersion = /^\d+\.\d+\.\d+$/.test(version)

    if (!isCdnEdgeVersion && !isCdnFixedVersion) {
      console.error(
        'Invalid version format. Please provide a valid LIFF SDK version.',
      )
      return
    }

    setVersionType(
      isCdnEdgeVersion ? LIFFSdkVersionType.EDGE : LIFFSdkVersionType.SPECIFIC,
    )

    const baseCdnUrl = 'https://static.line-scdn.net'
    const basePatchUrl = 'https://cdn.jsdelivr.net/gh/iamprompt/liff-sdk@latest'

    const baseUrl = patch ? basePatchUrl : baseCdnUrl

    const versionPath = isCdnEdgeVersion
      ? `/liff/edge/${version}/sdk.js`
      : `/liff/edge/versions/${version}/sdk.js`

    const script = document.createElement('script')
    script.src = `${baseUrl}${versionPath}`
    script.charset = 'UTF-8'
    script.onload = () => {
      console.log(`LIFF SDK v${version} loaded successfully.`)
      setIsSdkLoaded(true)
      initializeLIFF()
    }
    script.onerror = () => {
      console.error(`Failed to load LIFF SDK v${version}.`)
    }
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (isInit.current) {
      return
    }

    isInit.current = true

    loadSdk(query.version, query.patch)
  }, [query.patch, query.version, loadSdk])

  const initializeLIFF = async () => {
    try {
      await window.liff.init({ liffId: customLiffId })
      setIsReady(true)

      const userContext = window.liff.getContext()
      setContext(userContext)
      console.log('User context:', userContext)

      setIsInClient(window.liff.isInClient())
      setOS(window.liff.getOS())

      const canSendMessage = userContext?.scope.includes('chat_message.write')
      const canShareTargetPicker = isApiAvailable('shareTargetPicker')
      const canScanCodeV2 = isApiAvailable('scanCodeV2')

      const userCapabilities: LIFFCapabilities[] = []
      if (canSendMessage) {
        userCapabilities.push(LIFFCapabilities.SEND_MESSAGE)
      }
      if (canShareTargetPicker) {
        userCapabilities.push(LIFFCapabilities.SHARE_TARGET_PICKER)
      }
      if (canScanCodeV2) {
        userCapabilities.push(LIFFCapabilities.SCAN_CODE_V2)
      }
      setCapabilities(userCapabilities)

      if (window.liff.isLoggedIn()) {
        console.log('User is logged in')
        setIsLoggedIn(true)

        const userProfile = await window.liff.getProfile()
        setProfile(userProfile)
        console.log('User profile:', userProfile)

        const idToken = window.liff.getDecodedIDToken()
        console.log('Decoded ID Token:', idToken)
        setDecodedIDToken(idToken)
      }
    } catch (error) {
      console.error('LIFF initialization failed:', error)
    }
  }

  const login = () => {
    if (!isReady) {
      console.warn(
        'LIFF is not ready. Please wait for LIFF to initialize before calling login.',
      )
      return
    }
    window.liff.login({
      redirectUri: window.location.href,
    })
  }

  const logout = () => {
    if (!isReady) {
      console.warn(
        'LIFF is not ready. Please wait for LIFF to initialize before calling logout.',
      )
      return
    }
    window.liff.logout()
    setIsLoggedIn(false)
    setProfile(null)
    setDecodedIDToken(null)
    console.log('User logged out successfully.')
  }

  const setSdkVersion = async (version: string, patch: boolean) => {
    const isCdnEdgeVersion = /^\d+$/.test(version)
    const isCdnFixedVersion = /^\d+\.\d+\.\d+$/.test(version)
    if (!isCdnEdgeVersion && !isCdnFixedVersion) {
      console.error(
        'Invalid version format. Please provide a valid LIFF SDK version.',
      )
      return
    }

    setVersionType(
      isCdnEdgeVersion ? LIFFSdkVersionType.EDGE : LIFFSdkVersionType.SPECIFIC,
    )

    setQuery({
      version,
      patch,
    })

    await new Promise((resolve) => setTimeout(resolve, 200))

    window.alert(
      `LIFF SDK version set to ${version}${patch ? ' (patch)' : ''}. The page will reload to apply the changes.`,
    )

    document.location.reload()
  }

  return {
    isReady,
    isLoggedIn,
    login,
    logout,
    isSdkLoaded,
    setSdkVersion,
    profile,
    decodedIDToken,
    context,
    isInClient,
    os,
    capabilities,
    sdkVersion: {
      version: query.version,
      patch: query.patch,
      type: versionType,
    },
  }
}
