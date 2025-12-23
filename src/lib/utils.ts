import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

const formatDate = (date: string) => {
  return format(new Date(date), "Pp")
}

const centsToDollars = (cents: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100)
}

/**
 * Checks if a string represents a valid, finite number.
 *
 * @param value The string to check.
 * @returns True if the string is a number, false otherwise.
 */
function isStringNumeric(value: string): boolean {
  // Use the unary plus (+) operator to convert the string to a number.
  const numericValue = +value

  // Check if the result is not NaN and is a finite number.
  // isNaN checks if the conversion resulted in 'Not-a-Number'.
  // isFinite excludes Infinity and -Infinity.
  return !isNaN(numericValue) && isFinite(numericValue)
}

export { cn, formatDate, centsToDollars, isStringNumeric }
