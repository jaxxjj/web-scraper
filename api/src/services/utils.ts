// 延迟函数
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// random delay, simulate human behavior
export const randomDelay = async (min = 1000, max = 3000): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1) + min)
  await new Promise((resolve) => setTimeout(resolve, delay))
}

// generate random user agent
export const getRandomUserAgent = (): string => {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    // add more user agents
  ]
  return userAgents[Math.floor(Math.random() * userAgents.length)]
}

// date format function
export const formatDate = (dateStr: string): Date | null => {
  if (!dateStr) return null

  // clean date string
  const cleanDateStr = dateStr.trim()

  // define date format patterns
  const datePatterns = [
    {
      // Dec 25, 2023 or December 25, 2023
      pattern: /^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/,
      handler: (match: RegExpMatchArray) => {
        const [_, month, day, year] = match
        const date = new Date(`${month} ${day}, ${year}`)
        return isValidDate(date) ? date : null
      },
    },
    {
      // 2023-12-25 or 2023/12/25
      pattern: /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/,
      handler: (match: RegExpMatchArray) => {
        const [_, year, month, day] = match
        const date = new Date(`${year}-${month}-${day}`)
        return isValidDate(date) ? date : null
      },
    },
    {
      // 12/25/2023 or 12-25-2023
      pattern: /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/,
      handler: (match: RegExpMatchArray) => {
        const [_, month, day, year] = match
        const date = new Date(`${year}-${month}-${day}`)
        return isValidDate(date) ? date : null
      },
    },
    {
      // relative date: "2 days ago", "1 week ago", "3 months ago"
      pattern: /^(\d+)\s+(day|week|month|year)s?\s+ago$/,
      handler: (match: RegExpMatchArray) => {
        const [_, amount, unit] = match
        const now = new Date()
        const num = parseInt(amount)

        switch (unit) {
          case 'day':
            now.setDate(now.getDate() - num)
            break
          case 'week':
            now.setDate(now.getDate() - num * 7)
            break
          case 'month':
            now.setMonth(now.getMonth() - num)
            break
          case 'year':
            now.setFullYear(now.getFullYear() - num)
            break
        }

        return now
      },
    },
  ]

  // check each pattern
  for (const { pattern, handler } of datePatterns) {
    const match = cleanDateStr.match(pattern)
    if (match) {
      const result = handler(match)
      if (result) return result
    }
  }

  // if all patterns fail, try to parse directly
  const fallbackDate = new Date(cleanDateStr)
  return isValidDate(fallbackDate) ? fallbackDate : null
}

// helper function: check if date is valid
const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime())
}
