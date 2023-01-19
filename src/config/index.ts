const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'http://114.132.237.200:3000/'
const TIME_OUT = 10000

const ERROR_TYPE = {
  TOKEN_INVALID: '授权已过期，请重新登录！',
  NETWORK_ERROR: '网络发生异常！',
}

const TIP_TYPE = {
  LOGIN_INFO_ERROR: '输入的账号或密码错误，请重新输入！',
  LOGIN_SUCCESS: '登录成功，即将跳转！',
  UPDATE_PASS_SUCCESS: '修改密码成功，即将跳转到登录界面！',
  UPDATE_PASS_FAIL: '修改密码失败，请检查输入的信息是否准确！',
  PASS_INFO_ERROR: '输入的信息不完整，请重新输入！',
}

export { BASE_URL, TIME_OUT, ERROR_TYPE, TIP_TYPE }
