import { io } from 'socket.io-client'
import { WEBSOCKET_URL } from '@/config'
import useStore from '@/store'
import { onAddContactNotice, onUpdatecontactList } from './contactNotice'
import { onAddGroupNotice, onUpdateGroupList } from './groupNotice'

interface WebSocketControllerType {
  url: string
  websocket: any
  heartbeatTimer: any
  activeClose: boolean
  maxReconnectCount: number
  currentReconnectCount: number
  reconnectTimer: any
  init: () => void
  listen: (event: string, callback: (data?: any) => void) => void
  send: (event: string, data?: any) => void
  heartbeat: () => void
  reconnect: () => void
  close: () => void
  isConnected: () => boolean
}

class WebSocketController implements WebSocketControllerType {
  url: string // websocket 服务器的 url
  websocket: any // 客户端 websocket 对象
  heartbeatTimer: any // 心跳检测定时器
  activeClose: boolean // 是否主动关闭连接
  maxReconnectCount: number // 最大重连次数
  currentReconnectCount: number // 当前重连次数
  reconnectTimer: any // 重连计时器
  constructor(url: string) {
    this.url = url
    this.activeClose = false
    this.maxReconnectCount = 10
    this.currentReconnectCount = 0
    this.reconnectTimer = null
  }

  // websocket 初始化
  init() {
    const websocket = io(this.url)
    // 连接成功
    websocket.on('connect', () => {
      const store = useStore()
      this.heartbeat()
      this.send('connection', { userId: store.user_id })
      this.currentReconnectCount = 0
      console.log(websocket.id, '连接成功!')
    })
    // 连接超时
    websocket.on('connect_timeout', (data: any) => {
      console.log('连接超时!', data)
    })
    // 连接失败
    websocket.io.on('error', (error: any) => {
      console.log(this.currentReconnectCount)
      clearInterval(this.heartbeatTimer)
      if (this.currentReconnectCount >= this.maxReconnectCount) {
        console.log('已达到最大重连次数，请查看服务器是否异常！')
      } else {
        console.log('连接发生错误, 等待五秒后重连!', error)
        this.reconnectTimer = setTimeout(() => {
          this.currentReconnectCount++
          this.reconnect()
        }, 5000)
      }
    })
    // 断开连接
    websocket.on('disconnect', (reason: string) => {
      clearInterval(this.heartbeatTimer)
      if (this.activeClose) {
        console.log('连接已手动关闭!', reason)
      } else {
        this.reconnect()
        console.log('连接已关闭, 正在重连!', reason)
      }
    })
    this.websocket = websocket
    initListenEvent(this)
  }

  // 监听
  listen(event: string, callback: (data?: any) => void) {
    this.websocket.on(event, callback)
  }

  // 发送
  send(event: string, data?: any) {
    this.websocket.emit(event, data)
  }

  /**
   * 心跳检测: 客户端和服务器都会向对方询问
   * 客户端向服务器确认是否连接，如果服务器有一次没有回应，则客户端断开连接
   * 服务器向客户端确认是否连接，如果客户端有一次没有回应，则服务器断开连接，之后更新客户端最后在线时间
   * 服务器接收到客户端断开连接，更新客户端最后在线时间
   */
  heartbeat() {
    let isApply = true // 默认服务器已回应
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
    }
    // 服务器向客户端确认是否连接
    this.listen('clientCheck', () => {
      this.send('clientCheck')
    })
    // 客户端向服务器确认是否连接
    this.listen('serverCheck', () => {
      isApply = true
    })
    this.heartbeatTimer = setInterval(() => {
      if (isApply) {
        // 上一次检测已被回应
        isApply = false
        this.send('serverCheck')
        console.log('服务器已回应！')
      } else {
        // 上一次检测没有被回应，重连
        this.reconnect()
      }
    }, 10000)
  }

  // 重连
  reconnect() {
    clearTimeout(this.reconnectTimer)
    this.activeClose = false
    if (this.websocket) {
      this.websocket.close()
    }
    this.init()
  }

  // 手动断开连接
  close() {
    clearInterval(this.heartbeatTimer)
    this.activeClose = true
    this.websocket.close()
  }

  // 判断 websocket 是否连接
  isConnected() {
    return !!this.websocket?.connected
  }
}

// 初始化 websocket 的事件监听
const initListenEvent = (websocket: any) => {
  // 添加联系人的通知
  websocket.listen('addContactNotice', onAddContactNotice)
  // 添加群聊的通知
  websocket.listen('addGroupNotice', onAddGroupNotice)
  // 更新联系人列表
  websocket.listen('updateContactList', onUpdatecontactList)
  // 更新群聊列表
  websocket.listen('updateGroupList', onUpdateGroupList)
}

const websocket = new WebSocketController(WEBSOCKET_URL)

export default websocket
