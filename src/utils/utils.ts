// 防抖函数
export const debounce = (fn: () => void, delay = 500) => {
  let timer: any = null
  return function (this: any, ...args: any) {
    const arg = args
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arg)
    }, delay)
  }
}

// 时间格式化
// 0 - 年月日时分秒，1 - 年月日，2 - 时分秒
export const formateTime = (timeStr: string, type = 0) => {
  const time = new Date(timeStr)
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const day = time.getDate()
  const hour = time.getHours()
  const minute = time.getMinutes()
  const second = time.getSeconds()

  const onlyDateStr = [year, month, day].map(formatNumber).join('-')
  const onlyTimeStr = [hour, minute, second].map(formatNumber).join(':')

  if (type === 0) {
    return `${onlyDateStr} ${onlyTimeStr}`
  } else if (type === 1) {
    return onlyDateStr
  } else if (type === 2) {
    return onlyTimeStr
  }
}

const formatNumber = (n: number) => {
  return n.toString().padStart(2, '0')
}
