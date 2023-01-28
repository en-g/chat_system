const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'http://114.132.237.200:3000/'
const TIME_OUT = 10000

// 请求错误类型
const ERROR_TYPE = {
  TOKEN_INVALID: '授权已过期，请重新登录！',
  NETWORK_ERROR: '网络发生异常！',
}

// 弹窗提示类型
const TIP_TYPE = {
  LOGIN_INFO_ERROR: '输入的账号或密码错误，请重新输入！',
  LOGIN_SUCCESS: '登录成功，即将跳转！',
  UPDATE_PASS_SUCCESS: '修改密码成功！',
  UPDATE_PASS_FAIL: '修改密码失败，请检查输入的信息是否准确！',
  PASS_INFO_ERROR: '输入的信息不完整，请重新输入！',
  REGISTER_EMAIL_REPEAT: '输入的邮箱已被绑定，请重新输入！',
  REGISTER_USERNAME_REPEAT: '输入的用户名重复，请重新输入！',
  REGISTER_SUCCESS: '注册成功！',
  REGISTER_FAIL: '注册成功，请检查网络是否通畅！',
  REGISTER_INFO_ERROR: '输入的信息不完整，请重新输入！',
  VERIFICATION_CODE_ERROR: '验证码错误，请重新获取验证码！',
  VERIFICATION_CODE_EXPIRED: '验证码已过期，请重新获取验证码！',
  VERIFICATION_CODE_FAIL: '获取验证码失败，请重新获取！',
  VERIFICATION_CODE_SUCCESS: '获取验证码成功，请查看邮箱！',
  VERIFICATION_CODE_EMAIL_ERROR: '输入的邮箱或用户名无效，请输入正确的信息！',
  UPLOAD_AVATAR_FAIL: '上传头像失败，请重新上传！',
  UPLOAD_AVATAR_SUCCESS: '上传头像成功！',
  IMAGE_MIMETYPE_ERROR: '不支持的图片类型，请重新上传',
  WRITE_SELF_INFO_SUCCESS: '个人信息上传成功！',
  WRITE_SELF_INFO_FAIL: '个人信息上传失败',
  WRITE_SELF_INFO_ERROR: '输入的个人信息不完整，请重新输入！',
  RANDOM_SELF_INFO_FAIL: '随机生成个人信息失败，请重新注册！',
  RANDOM_SELF_INFO_SUCCESS: '随机生成个人信息成功！',
  EMAIL_NOT_NULL: '邮箱不能为空，请重新输入！',
  UPDATE_CONTACTS_REMARKS_SUCCESS: '修改联系人备注成功！',
  UPDATE_CONTACTS_REMARKS_FAIL: '修改联系人备注失败，请检查网络是否通畅！',
  UPDATE_GROUPS_REMARKS_SUCCESS: '修改群昵称成功！',
  UPDATE_GROUPS_REMARKS_FAIL: '修改群昵称失败，请检查网络是否通畅！',
}

export { BASE_URL, TIME_OUT, ERROR_TYPE, TIP_TYPE }
