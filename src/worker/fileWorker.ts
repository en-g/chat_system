import SparkMD5 from 'spark-md5'
// self.importScripts('https://cdn.bootcdn.net/ajax/libs/spark-md5/3.0.2/spark-md5.min.js')
self.onmessage = (e) => {
  const { file, defauktChunkSize = 5 * 1024 * 1024 } = e.data
  const chunks: number = Math.ceil(file.size / defauktChunkSize) // 计算切片数量
  let currentChunk = 0 // 当前切片索引
  const chunkList: any[] = [] // 切片列表
  const spark = new SparkMD5.ArrayBuffer()
  const fileReader: FileReader = new FileReader()

  fileReader.onload = (e) => {
    const chunk = e.target?.result as ArrayBuffer // 切片的二进制数据
    spark.append(chunk)
    chunkList.push({
      // 保存切片数据，并进行编号
      id: currentChunk + 1,
      data: chunk,
    })
    currentChunk++

    if (currentChunk < chunks) {
      // 未读完，继续读
      loadNext()
    } else {
      // 读取完毕
      const fileHash = spark.end() // 计算整个文件的 md5 值
      // 将 md5 值和切片列表发送给主线程
      self.postMessage({
        status: 1,
        fileHash,
        chunkList,
      })
    }
  }

  fileReader.onerror = () => {
    self.postMessage({ status: 0 })
  }

  // 读取文件的下一个切片
  const loadNext = () => {
    const start = currentChunk * defauktChunkSize
    const end = start + defauktChunkSize >= file.size ? file.size : start + defauktChunkSize
    const chunk = File.prototype.slice.call(file, start, end)
    fileReader.readAsArrayBuffer(chunk)
  }
  loadNext()
}
