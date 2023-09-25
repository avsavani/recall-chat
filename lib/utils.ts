import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function pluralize(
  word: string,
  count: number,
  pluralForm?: string
): string {
  if (count === 1) {
    return word
  }

  if (pluralForm) {
    return pluralForm
  }

  return `${word}s`
}

function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString)
    return true
  } catch {
    return false
  }
}

function removeLeadingDash(pathPart: string): string {
  return pathPart.startsWith(` - `) ? pathPart.substring(1) : pathPart
}

function getSecondLevelDomain(hostname: string): string {
  return hostname.split(".").slice(-2, -1).join(".")
}

function removeFileExtension(pathPart: string | undefined): string {
  if (!pathPart) return ""
  return pathPart.replace(/\.[^/.]+$/, "")
}

function shortenLastPathPart(pathPart: string, maxLength: number): string {
  if (!pathPart) return ""
  return pathPart.length > maxLength
    ? pathPart.substring(0, maxLength)
    : pathPart
}

export function formatLongUrl(longUrl: string, maxLength: number = 15): string {
  if (!isValidUrl(longUrl)) return "Invalid URL"

  const cleanUrl = removeLeadingDash(longUrl)
  const url = new URL(cleanUrl)
  const hostname = getSecondLevelDomain(url.hostname)
  const pathParts = url.pathname.split("/").filter((part) => part !== "")
  let lastPathPart = pathParts[pathParts.length - 1]

  lastPathPart = removeFileExtension(lastPathPart)
  lastPathPart = shortenLastPathPart(lastPathPart, maxLength)

  const shortUrl = `${hostname}${lastPathPart ? "/" : ""}${lastPathPart}`
  //   return shortUrl
  return shortUrl.replace(/-/g, "")
}

// A function that takes a file name and a string and returns true if the file name is contained in the string
// after removing punctuation and whitespace from both
export const isFileNameInString = (fileName: string, str: string) => {
  // Check if the input string is null or undefined
  if (!str) {
    return false
  }

  // Convert both to lowercase and remove punctuation and whitespace
  const normalizedFileName = fileName
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=-_~()\s]/g, "")
  const normalizedStr = str
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=-_~()\s]/g, "")

  // Return true if the normalized file name is included in the normalized string
  return normalizedStr.includes(normalizedFileName)
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export function truncateLongFileName(
  fileName: string,
  maxLength: number = 15
): string {
  const fileBaseName = fileName.replace(/\.[^/.]+$/, "") // Remove file extension
  const fileExtension = fileName.match(/\.[^/.]+$/) || [""] // Get file extension

  // If fileName's length is smaller than maxLength, return original fileName:
  if (!fileBaseName) return ""
  if (fileBaseName.length + fileExtension[0].length <= maxLength) {
    return fileName
  }

  // Define lengths for start and end parts:
  const startLength = Math.floor(maxLength / 2) - 2 // -2 to leave room for '...'
  const endLength = maxLength - startLength - fileExtension[0].length - 2 // -1 if you count '.' as part of the extension length

  const startPart = fileBaseName.slice(0, startLength)
  const endPart = fileBaseName.slice(-endLength)

  return `${startPart}...${endPart}${fileExtension[0]}`
}
export function truncateLongUrl(
  url: string | null, // allow a null url
  maxLength: number = 30
): string {
  // Null-check: if the URL is null or undefined, return an empty string
  if (!url) {
    return ""
  }

  // Truncate URL if its length is more than maxLength
  if (url.length > maxLength) {
    // Calculate the lengths of the start and end parts of URL
    const startUrlLength = maxLength / 2
    const endUrlLength = maxLength - startUrlLength

    // Extract the start and end parts
    const startUrlPart = url.slice(0, startUrlLength)
    const endUrlPart = url.slice(-endUrlLength)

    // Reconstruct the URL
    url = startUrlPart + "..." + endUrlPart
  }

  return url
}
