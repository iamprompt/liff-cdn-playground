import { type Liff } from '@line/liff'
import androidManifestFixPlugin from 'liff-plugin-android-manifest-fix'

declare global {
  interface Window {
    liff: Liff
    androidManifestFixPlugin: typeof androidManifestFixPlugin
  }
}

export {}
