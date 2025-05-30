import { LoadingSpinner } from './LoadingSpinner'

export const FullPageLoading = () => {
  return (
    <div className="flex h-dvh w-screen items-center justify-center bg-white dark:bg-black">
      <LoadingSpinner />
    </div>
  )
}
