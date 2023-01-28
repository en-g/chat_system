interface StorageInterface {
  keyPrefix?: string
  get: (key: string) => any
  set: (key: string, value: any) => void
  has: (key: string) => boolean
  delete: (key: string, index: number) => void
  remove: (key: string) => void
  clear: () => void
  clearSelf: () => void
}

const lStorage = window.localStorage
const sStorage = window.sessionStorage

class LStorage implements StorageInterface {
  keyPrefix?: string
  constructor(keyPrefix?: string) {
    this.keyPrefix = keyPrefix ? `cs_${keyPrefix}` : 'cs'
  }

  get(key: string): any {
    const skey = `${this.keyPrefix}_${key}`
    let data = lStorage.getItem(skey)
    data = data ? JSON.parse(data) : data
    return data
  }

  set(key: string, value: any): void {
    const skey = `${this.keyPrefix}_${key}`
    if (value) {
      lStorage.setItem(skey, JSON.stringify(value))
    }
  }

  has(key: string): boolean {
    const skey = `${this.keyPrefix}_${key}`
    return !!lStorage.getItem(skey)
  }

  delete(key: string, index: number) {
    const data = this.get(key) || []
    data.splice(index, 1)
    this.set(key, data)
  }

  remove(key: string): void {
    const skey = `${this.keyPrefix}_${key}`
    lStorage.removeItem(skey)
  }

  clear(): void {
    lStorage.clear()
  }

  clearSelf(): void {
    if (this.keyPrefix) {
      const arr = Array.from({ length: lStorage.length }, (_, index) => lStorage.key(index)).filter((key) =>
        key?.startsWith(this.keyPrefix as string)
      )
      arr.forEach((key) => lStorage.removeItem(key as string))
    }
  }
}

class SStorage implements StorageInterface {
  keyPrefix?: string
  constructor(keyPrefix?: string) {
    this.keyPrefix = keyPrefix ? `cs_${keyPrefix}` : 'cs'
  }

  get(key: string): any {
    const skey = `${this.keyPrefix}_${key}`
    let data = sStorage.getItem(skey)
    data = data ? JSON.parse(data) : data
    return data
  }

  set(key: string, value: any): void {
    const skey = `${this.keyPrefix}_${key}`
    if (value) {
      sStorage.setItem(skey, JSON.stringify(value))
    }
  }

  has(key: string): boolean {
    const skey = `${this.keyPrefix}_${key}`
    return !!sStorage.getItem(skey)
  }

  delete(key: string, index: number) {
    const data = this.get(key) || []
    data.splice(index, 1)
    this.set(key, data)
  }

  remove(key: string): void {
    const skey = `${this.keyPrefix}_${key}`
    sStorage.removeItem(skey)
  }

  clear(): void {
    sStorage.clear()
  }

  clearSelf(): void {
    if (this.keyPrefix) {
      const arr = Array.from({ length: sStorage.length }, (_, index) => sStorage.key(index)).filter((key) =>
        key?.startsWith(this.keyPrefix as string)
      )
      arr.forEach((key) => sStorage.removeItem(key as string))
    }
  }
}

export function localStorage(keyPrefix?: string): LStorage {
  return new LStorage(keyPrefix)
}

export function sessionStorage(keyPrefix?: string): SStorage {
  return new SStorage(keyPrefix)
}
