interface RetryOptions {
  maxRetries?: number
  delay?: number
  backoff?: number
}

export const errorHandler = {
  retry: async <T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> => {
    const { maxRetries = 3, delay = 1000, backoff = 2 } = options

    let lastError: Error

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error
        if (attempt === maxRetries) break

        // exponential backoff
        const waitTime = delay * Math.pow(backoff, attempt - 1)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
      }
    }

    throw lastError
  },
}
