const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'http://114.132.237.200:3000/'
const WEBSOCKET_URL = process.env.NODE_ENV === 'development' ? 'ws://localhost:3002/' : 'ws://114.132.237.200:3002/'
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
  UPLOAD_IMAGE_FAIL: '上传图片失败，请重新上传！',
  UPLOAD_IMAGE_SUCCESS: '上传图片成功！',
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
  ADD_FRIEND_GROUP_SUCCESS: '添加分组成功！',
  ADD_FRIEND_GROUP_FAIL: '添加分组失败，请检查网络是否通畅！',
  FRIEND_GROUP_IS_NOT_NULL: '添加的分组不能为空，请重新输入！',
  FRIEND_GROUP_HAS_EXIST: '该分组已存在，请重新添加其他分组！',
  DELETE_FRIEND_GROUP_SUCCESS: '删除分组成功！',
  DELETE_FRIEND_GROUP_FAIL: '删除分组失败，请检查网络是否通畅！',
  FRIEND_GROUP_IS_LAST_ONE: '当前只剩下一个分组，无法继续删除！',
  UPDATE_PERSONAL_INFO_SUCCESS: '修改个人信息成功！',
  UPDATE_PERSONAL_INFO_FAIL: '修改个人信息失败！',
  TIDING_CONTENT_IS_NOT_NULL: '动态内容不能为空，请重新输入！',
  TIDING_TITLE_IS_NOT_NULL: '动态标题不能为空，请重新输入！',
  RELEASE_TIDING_SUCCESS: '发布动态成功！',
  RELEASE_TIDING_FAIL: '发布动态失败，请检查网络是否通畅！',
  COMMENT_IS_NOT_NULL: '评论不能为空，请重新输入！',
  SEND_TIDING_COMMENT_FAIL: '发送朋友圈动态评论失败，请检查网络是否通畅！',
  DELETE_PYQ_TIDING_SUCCESS: '删除朋友圈动态成功！',
  DELETE_PYQ_TIDING_FAIL: '删除朋友圈动态失败，请检查网络是否通畅！',
  FRIEND_GROUP_IS_NLL: '当前用户没有好友分组，请先添加好友分组！',
  ADD_CONTACT_SUCCESS: '添加联系人成功！',
  ADD_CONTACT_FAIL: '添加联系人失败，请检查网络是否通畅！',
  APPLY_SUCCESS: '申请成功，请等待回复！',
  REFUSE_ADD_CONTACT_SUCCESS: '已拒绝添加该联系人！',
  REFUSE_ADD_CONTACT_FAIL: '拒绝添加该联系人失败，请检查网络是否通畅！',
  ADD_GROUP_SUCCESS: '加入群聊成功！',
  ADD_GROUP_FAIL: '加入群聊失败，请检查网络是否通畅！',
  AGREE_ADD_GROUP_SUCCESS: '已同意该用户进入群聊！',
  AGREE_ADD_GROUP_FAIL: '同意该用户加入群聊失败，请检查网络是否通畅！',
  REFSE_GROUP_SUCCESS: '已拒绝加入该群聊！',
  REFUSE_GROUP_FAIL: '拒绝加入该群聊失败，请检查网络是否通畅！',
  REFUSE_AGREE_ADD_GROUP_SUCCESS: '已拒绝该用户进入群聊！',
  REFUSE_AGREE_ADD_GROUP_FAIL: '拒绝该用户加入群聊失败，请检查网络是否通畅！',
  GROUP_AVATAR_IS_NOT_NULL: '群聊头像不能为空，请添加群聊头像！',
  GROUP_NAME_IS_NOT_NULL: '群聊名称不能为空，请添加群聊名称！',
  CREATE_GROUP_SUCCESS: '创建群聊成功！',
  CREATE_GROUP_ERROR: '创建群聊失败，请检查网络是否通畅！',
  UPDATE_CONTACT_FRIEND_GROUP_SCCESS: '修改用户新分组成功！',
  UPDATE_CONTACT_FRIEND_GROUP_FAIL: '修改用户新分组失败，请检查网络是否通畅！',
  DELETE_CONTACT_SUCCESS: '删除联系人成功！',
  DELETE_CONTACT_FAIL: '删除联系人失败，请检查网络是否通畅！',
  EXIT_GROUP_SUCCESS: '退出群聊成功！',
  EXIT_GROUP_FAIL: '退出群聊失败，请检查网络是否通畅！',
  DISMISS_GROUP_SUCCESS: '解散群聊成功！',
  DISMISS_GROUP_FAIL: '解散群聊失败，请检查网络是否通畅！',
  INVITE_GROUP_IS_NOT_NULL: '请选择要邀请的联系人！',
  INVITE_GROUP_SCCESS: '邀请成功，请等待回复！',
  UPLOAD_EMOTION_SCCESS: '上传表情包成功！',
  UPLOAD_EMOTION_FAIL: '上传表情包失败，请检查网络是否通畅！',
  COLLECT_LIFE_TIDING_SUCCESS: '收藏动态成功！',
  COLLECT_LIFE_TIDING_FAIL: '收藏动态失败！',
  CANCEL_COLLECT_LIFE_TIDING_SUCCESS: '取消收藏动态！',
  DELETE_LIFE_TIDING_SUCCESS: '删除生活圈动态成功！',
  NOT_COLLECTE_SELF_LIFE_TIDING: '不能收藏自己的动态！',
  COMMENT_FAIL: '评论失败，请检查网络是否通畅！',
  REPLY_IS_NOT_NLL: '回复内容不能为空，请重新输入！',
  REPLY_FAIL: '回复失败，请检查网络是否通畅！',
  ONLY_LEADER_CAN_UPDATE_GROUP_NAME: '只有群主能修改群聊名称！',
  ONLU_LEADER_CAN_UPDATE_GROUP_NOTICE: '只有群主能修改群聊公告！',
  UPDATE_GROUP_NAME_SUCCESS: '修改群聊名称成功！',
  UPDATE_GROUP_NAME_FAIL: '修改群聊名称失败，请检查网络是否通畅！',
  UPDATE_GROUP_NOTICE_SUCCESS: '修改群聊公告成功！',
  UPDATE_GROUP_NOTICE_FAIL: '修改群聊公告失败，请检查网络是否通畅！',
}

export { BASE_URL, WEBSOCKET_URL, TIME_OUT, ERROR_TYPE, TIP_TYPE }
