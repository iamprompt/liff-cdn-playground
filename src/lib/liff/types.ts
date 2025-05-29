import { type Liff } from '@line/liff'

export type Profile = Awaited<ReturnType<Liff['getProfile']>>
export type DecodedIDToken = Awaited<ReturnType<Liff['getDecodedIDToken']>>
export type Context = Awaited<ReturnType<Liff['getContext']>>
export type OS = Awaited<ReturnType<Liff['getOS']>>
