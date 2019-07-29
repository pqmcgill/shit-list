export function today() {
  // today() => "7/26/19"
  return format(new Date())
}

export function nextDay(day) {
  // nextDay("7/26/19") => "7/27/19"
  const date = new Date(day)
  const nextDate = new Date(day)
  return format(new Date(nextDate.setDate(date.getDate() + 1)))
}

export function previousDay(day) {
  // previousDay("7/26/19") => "7/25/19"
  const date = new Date(day)
  const nextDate = new Date(day)
  return format(new Date(nextDate.setDate(date.getDate() - 1)))
}

export function format(date) {
  return date.toLocaleDateString().split('/').join('-')
}