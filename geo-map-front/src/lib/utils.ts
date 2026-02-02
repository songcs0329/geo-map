import { clsx, type ClassValue } from "clsx"
import { format, parse, isValid } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * HTML 태그 제거 및 HTML 엔티티 디코딩
 */
export function stripHtmlTags(html: string): string {
  const withoutTags = html.replace(/<[^>]*>/g, "")
  const textarea = document.createElement("textarea")
  textarea.innerHTML = withoutTags
  return textarea.value
}

/**
 * YYYYMMDD 형식 날짜를 yyyy.MM.dd로 포맷
 */
export function formatPostDate(dateStr: string): string {
  if (dateStr.length !== 8) return dateStr
  const parsed = parse(dateStr, "yyyyMMdd", new Date())
  if (!isValid(parsed)) return dateStr
  return format(parsed, "yyyy.MM.dd")
}

/**
 * RFC 822 형식 날짜를 yyyy.MM.dd로 포맷
 */
export function formatPubDate(dateStr: string): string {
  const date = new Date(dateStr)
  if (!isValid(date)) return dateStr
  return format(date, "yyyy.MM.dd")
}
