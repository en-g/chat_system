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
