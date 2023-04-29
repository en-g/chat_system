interface IndexedDbInstanceType {
  db: any
  version: number
  dbName: string
  openDB: () => void
  addData: (storeName: string, data: any) => Promise<any>
  getDataByKey: (storeName: string, key: number) => Promise<any>
  getDataByIndex: (storeName: string, indexName: string, indexValue: any) => Promise<any>
  updateDB: (storeName: string, data: any) => Promise<any>
  deleteData: (storeName: string, key: number) => Promise<any>
  deleteDB: (dbName: any) => Promise<any>
  closeDB: () => void
}

class IndexedDbInstance implements IndexedDbInstanceType {
  db: any
  version = 1
  dbName: string
  constructor(dbName: string, version?: number) {
    this.version = version || this.version
    this.dbName = dbName
    this.openDB()
  }

  // 创建数据库
  openDB() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
    if (!indexedDB) {
      console.log('浏览器不支持IndexedDB')
    }
    // 创建或者打开一个数据库
    const request = indexedDB.open(this.dbName, this.version)

    // 打开数据库成功
    request.onsuccess = (event: any) => {
      this.db = event.target.result // 数据库对象
      console.log('IndexedDB连接成功')
    }

    // 打开数据库报错
    request.onerror = () => {
      console.log('IndexedDB连接失败')
    }

    // 数据库创建或升级的时候会触发
    request.onupgradeneeded = (event: any) => {
      this.db = event.target.result // 数据库对象
      if (!this.db.objectStoreNames.contains('friendChatMessages')) {
        // 创建存储库
        const friendChatMessagesStore = this.db.createObjectStore('friendChatMessages', {
          keyPath: 'id', // 主键
        })
        // 创建索引，在后面查询数据的时候可以根据索引查
        friendChatMessagesStore.createIndex('chatIds', ['fromId', 'toId'], { unique: false })
      }
      if (!this.db.objectStoreNames.contains('groupChatMessages')) {
        const groupChatMessagesStore = this.db.createObjectStore('groupChatMessages', {
          keyPath: 'id', // 主键
        })
        // 创建索引，在后面查询数据的时候可以根据索引查
        groupChatMessagesStore.createIndex('groupId', 'groupId', { unique: false })
        groupChatMessagesStore.createIndex('fromId', 'fromId', { unique: false })
      }
    }
  }

  // 新增数据
  addData(storeName: string, data: any) {
    return new Promise((resolve, reject) => {
      const request = this.db
        .transaction([storeName], 'readwrite') // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
        .objectStore(storeName) // 仓库对象
        .add(data)

      request.onsuccess = (event: any) => {
        console.log('写入数据成功')
        resolve(event.target.result)
      }

      request.onerror = (event: any) => {
        console.log('写入数据失败')
        reject(event)
      }
    })
  }

  // 通过主键读取数据
  getDataByKey(storeName: string, key: number) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName]) // 事务
      const objectStore = transaction.objectStore(storeName) // 仓库对象
      const request = objectStore.get(key)

      request.onerror = (event: any) => {
        reject(event)
      }

      request.onsuccess = (event: any) => {
        resolve(request.result)
      }
    })
  }

  // 通过索引读取数据
  getDataByIndex(storeName: string, indexName: string, indexValue: any) {
    const store = this.db.transaction(storeName, 'readwrite').objectStore(storeName)
    const request = store.index(indexName).getAll(indexValue)
    return new Promise((resolve, reject) => {
      request.onerror = (e: any) => {
        reject(e)
      }
      request.onsuccess = (e: any) => {
        resolve(e.target.result)
      }
    })
  }

  // 更新数据（根据主键来更新，如果主键数据不存在则新建）
  updateDB(storeName: string, data: any) {
    const request = this.db
      .transaction([storeName], 'readwrite') // 事务对象
      .objectStore(storeName) // 仓库对象
      .put(data)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(true)
      }

      request.onerror = () => {
        resolve(false)
      }
    })
  }

  // 删除数据(根据主键删除)
  deleteData(storeName: string, key: number) {
    const request = this.db.transaction([storeName], 'readwrite').objectStore(storeName).delete(key)

    return new Promise((resolve, reject) => {
      request.onsuccess = function () {
        resolve(true)
      }

      request.onerror = function () {
        resolve(false)
      }
    })
  }

  // 删除数据库
  deleteDB(dbName: any) {
    const deleteRequest = window.indexedDB.deleteDatabase(dbName)
    return new Promise((resolve, reject) => {
      deleteRequest.onerror = () => {
        resolve('删除失败')
      }
      deleteRequest.onsuccess = () => {
        resolve('删除成功')
      }
    })
  }

  // 关闭数据库
  closeDB() {
    this.db.close()
    console.log('IndexedDB已关闭')
  }
}

const createIndexedDB = (): IndexedDbInstance => {
  const instance = new IndexedDbInstance('chat_system')
  return instance
}

const idb = createIndexedDB()

export default idb
