import type { ReactNode } from 'react'
import { LIFFContext, useLIFFContext } from './context'

export function LIFFProvider({ children }: { children: ReactNode }) {
  const context = useLIFFContext()
  return <LIFFContext.Provider value={context}>{children}</LIFFContext.Provider>
}
