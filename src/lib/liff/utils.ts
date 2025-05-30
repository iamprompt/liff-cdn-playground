export const isApiAvailable = (apiName: string) => {
  try {
    return window.liff?.isApiAvailable(apiName) || false
  } catch (error) {
    return false
  }
}
