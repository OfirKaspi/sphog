const LOCAL_MOBILE_REGEX = /^05\d{8}$/
const INTL_MOBILE_REGEX_WITH_PLUS = /^\+9725\d{8}$/
const INTL_MOBILE_REGEX_NO_PLUS = /^9725\d{8}$/

function compactPhoneInput(value: string) {
  return value.trim().replace(/[()\-\s]/g, "")
}

export function normalizeIsraeliPhone(value: string): string | null {
  const compact = compactPhoneInput(value)

  if (LOCAL_MOBILE_REGEX.test(compact)) {
    return compact
  }

  if (INTL_MOBILE_REGEX_WITH_PLUS.test(compact)) {
    return `0${compact.slice(4)}`
  }

  if (INTL_MOBILE_REGEX_NO_PLUS.test(compact)) {
    return `0${compact.slice(3)}`
  }

  return null
}

export function isValidIsraeliMobile(value: string): boolean {
  return normalizeIsraeliPhone(value) !== null
}
