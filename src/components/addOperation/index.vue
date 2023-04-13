<template>
  <div class="add-operation-container">
    <div class="add-operation-icon" @click="listenShowAddMenu">
      <el-icon><Plus color="#1aadf9" /></el-icon>
    </div>
    <div v-show="isShowMenu" class="add-operation-menu">
      <div class="add-operation-menu-item" @click="listenAddContactOrGroup">添加联系人/群聊</div>
      <div class="add-operation-menu-item" @click="listenCreateGroup">创建群聊</div>
    </div>
    <el-dialog v-model="addContactOrGroupVisible" title="添加联系人/群聊" width="30%">
      <div class="add-contact-group">
        <div class="add-contact-group-search">
          <el-input
            v-model="searchKeyword"
            size="default"
            clearable
            placeholder="请输入联系人/群组名称"
            @input="listenKeywordChange"
          />
        </div>
        <div class="add-contact-group-result">
          <el-scrollbar class="add-contact-group-result-scroll">
            <div v-if="!!searchContactOrGroupResult.length" class="add-contact-group-result-list">
              <div v-for="item in searchContactOrGroupResult" :key="item.id" class="add-contact-group-result-list-item">
                <div class="avatar">
                  <el-avatar :size="40" :src="item.avatarUrl" />
                </div>
                <div class="desc">
                  <div class="name-tag">
                    <div class="name">{{ item.name }}</div>
                    <div v-show="item.isGroup" class="tag">
                      <el-tag effect="light">群聊</el-tag>
                    </div>
                  </div>
                  <div v-if="item.signature" class="signature">{{ item.signature }}</div>
                </div>
                <div class="op">
                  <div v-if="!item.isAdd" class="no-add">
                    <svg class="icon" aria-hidden="true" @click="listenRequestAddContactOrGroup(item.id)">
                      <use xlink:href="#icon-add"></use>
                    </svg>
                  </div>
                  <div v-else class="added">
                    <el-tag effect="light" type="info">已添加</el-tag>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="add-contact-group-no-result">暂无搜索结果</div>
          </el-scrollbar>
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="addVaalidateVisible" title="请填写申请信息" width="30%">
      <div class="add-apply-info">
        <div class="add-apply-contact">
          <div class="avatar">
            <el-avatar :size="40" :src="applicationObject?.avatarUrl" />
          </div>
          <div class="info">
            <div class="name">{{ applicationObject?.name }}</div>
            <div v-if="applicationObject?.signature" class="signature">{{ applicationObject?.signature }}</div>
          </div>
        </div>
        <div class="add-apply-verification">
          <div class="title">验证人需要验证您的身份，请输入您的请求信息</div>
          <div class="verification-info">
            <el-input
              v-model="verificationInfo"
              :rows="3"
              maxlength="50"
              show-word-limit
              resize="none"
              type="textarea"
              size="default"
              placeholder="请输入请求信息"
            />
          </div>
        </div>
        <div v-if="!applicationObject?.isGroup" class="add-apply-group">
          <div class="label">分组：</div>
          <div class="select">
            <el-select v-model="applyGroup" size="default" clearable placeholder="请选择分组">
              <el-option v-for="item in friendGroups" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </div>
        </div>
        <div v-if="!applicationObject?.isGroup" class="add-apply-remarks">
          <div class="label">备注：</div>
          <div class="input">
            <el-input
              v-model="applyRemarks"
              size="default"
              maxlength="10"
              placeholder="请输入备注"
              clearable
              type="text"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <span class="button">
          <el-button class="item" size="default" @click="addVaalidateVisible = false">取消</el-button>
          <el-button class="item" size="default" type="primary" @click="listenSendAddApplication"> 发送 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="createGroupVisible" title="创建群聊" width="30%">
      <div class="create-group">
        <div class="choose-avatar">
          <div class="label">选择头像</div>
          <div class="avatar">
            <div class="upload-avatar">
              <el-upload class="upload" :show-file-list="false" :auto-upload="false" :on-change="listenAvatarChange">
                <img v-if="createGroupInfo.avatarUrl" :src="createGroupInfo.avatarUrl" class="avatar" />
                <el-icon v-else class="icon"><Plus /></el-icon>
              </el-upload>
            </div>
            <div class="default-avatar">
              <div
                v-for="item in defaultGroupAvatarList"
                :key="item.id"
                class="item"
                @click="listenChooseAvatar(item.id, item.url)"
              >
                <el-avatar shape="square" :size="60" fit="fill" :src="item.url" />
                <div v-show="chooseAvatarId === item.id" class="choose"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="nominate">
          <div class="label">快给群聊起个名字吧</div>
          <div class="name">
            <el-input
              v-model="createGroupInfo.name"
              maxlength="10"
              placeholder="输入群名"
              show-word-limit
              type="text"
            />
          </div>
        </div>
        <div class="apply-contact">
          <div class="label">来邀请你的好友进群吧</div>
          <el-scrollbar class="contact-list-scroll">
            <div class="contact-list">
              <div
                v-for="item in contactList"
                :key="item.userId"
                class="contact-list-item"
                @click="listenChooseContact(item.userId)"
              >
                <div class="avatar">
                  <el-avatar :size="30" fit="fill" :src="item.avatarUrl" />
                </div>
                <div class="name">{{ item.nickname }}</div>
                <div v-show="createGroupInfo.members.includes(item.userId)" class="choose-icon">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-agree"></use>
                  </svg>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <template #footer>
        <span class="button">
          <el-button class="item" size="default" @click="listenCancleCreteGroup">取消</el-button>
          <el-button class="item" size="default" type="primary" @click="listenConfirmCreateGroup"> 创建 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { Plus } from '@element-plus/icons-vue'
  import { AddContactApplicationInfoType, AddGroupApplicationInfoType, ContactOrGroupResultType } from '@/types/navbar'
  import { debounce } from '@/utils/utils'
  import { getFriendGroupList, searchContactsOrGroups } from '@/api/contacts'
  import useStore from '@/store'
  import { FriendGroupsListType } from '@/types/contacts'
  import { ElMessage, UploadFile } from 'element-plus'
  import { TIP_TYPE } from '@/config'
  import websocket from '@/websocket'
  import { ContactListType, CreateGroupInfoType, DefaultGrouoAvatarListType } from '@/types/groups'
  import { createGroup, getAllContact, getGroupDefaultAvatrList } from '@/api/groups'
  import fileUpload from '@/utils/fileUpload'

  const store = useStore()

  const isShowMenu = ref<boolean>(false) // 标记菜单是否显示
  const addContactOrGroupVisible = ref<boolean>(false) // 标记是否显示添加联系人或群聊的 dialog
  const addVaalidateVisible = ref<boolean>(false) // 标记是否显示添加申请的 dialog
  const createGroupVisible = ref<boolean>(false) // 标记是否显示创建群聊的 dialog
  const searchKeyword = ref<string>('') // 搜索联系人/群组的关键字
  const verificationInfo = ref<string>('') // 申请验证信息
  const applyGroup = ref<number>(-1) // 申请验证的分组
  const applyRemarks = ref<string>('') // 申请验证的备注
  const friendGroups = reactive<FriendGroupsListType[]>([]) // 好友分组列表
  const searchContactOrGroupResult = reactive<ContactOrGroupResultType[]>([]) // 搜索结果
  let applicationObject: ContactOrGroupResultType | null = null // 申请对象
  // 创建群聊的信息
  const createGroupInfo = reactive<CreateGroupInfoType>({
    leaderId: store.user_id,
    name: '',
    avatarUrl: '',
    members: [],
  })
  const defaultGroupAvatarList = reactive<DefaultGrouoAvatarListType[]>([]) // 默认群聊头像列表
  const chooseAvatarId = ref<number>(-1) // 选择的默认群聊头像 ID
  const contactList = reactive<ContactListType[]>([])

  // 显示添加操作菜单
  const listenShowAddMenu = () => {
    isShowMenu.value = !isShowMenu.value
  }

  // 添加联系人/群聊
  const listenAddContactOrGroup = () => {
    searchKeyword.value = ''
    searchContactOrGroupResult.splice(0, searchContactOrGroupResult.length)
    isShowMenu.value = false
    addContactOrGroupVisible.value = true
  }

  // 获取群聊默认头像列表
  const getDefaultAvatarList = async () => {
    const { data } = await getGroupDefaultAvatrList()
    defaultGroupAvatarList.splice(0, defaultGroupAvatarList.length, ...data)
  }

  // 获取所有好友
  const getllContactList = async () => {
    const { data } = await getAllContact({
      userId: store.user_id,
    })
    contactList.splice(0, contactList.length, ...data)
  }

  // 创建群聊
  const listenCreateGroup = async () => {
    await getDefaultAvatarList()
    await getllContactList()
    // 初始化群聊信息
    chooseAvatarId.value = -1
    createGroupInfo.name = ''
    createGroupInfo.avatarUrl = ''
    createGroupInfo.members.splice(0, createGroupInfo.members.length)
    isShowMenu.value = false
    createGroupVisible.value = true
  }

  // 关键字改变，重新搜索，使用防抖
  const listenKeywordChange = debounce(async function () {
    if (!searchKeyword.value) {
      searchContactOrGroupResult.splice(0, searchContactOrGroupResult.length)
      return
    }
    const { data } = await searchContactsOrGroups({
      keyword: searchKeyword.value,
      userId: store.user_id,
    })
    searchContactOrGroupResult.splice(0, searchContactOrGroupResult.length, ...data)
  })

  // 点击请求添加联系人/群聊
  const listenRequestAddContactOrGroup = async (id: number) => {
    const info = searchContactOrGroupResult.find((item) => item.id === id)
    if (info) {
      if (!info.isGroup) {
        // 获取分组列表
        const { data } = await getFriendGroupList({
          userId: store.user_id,
        })
        friendGroups.splice(0, friendGroups.length, ...data)
        if (friendGroups.length === 0) {
          ElMessage.error(TIP_TYPE.FRIEND_GROUP_IS_NLL)
          return
        }
        applyGroup.value = friendGroups[0].id
      }
      applicationObject = info
      verificationInfo.value = ''
      applyRemarks.value = ''
      addContactOrGroupVisible.value = false
      addVaalidateVisible.value = true
    }
  }

  // 添加联系人/群聊申请
  const listenSendAddApplication = () => {
    if (applicationObject?.isGroup) {
      const info: AddGroupApplicationInfoType = {
        fromId: store.user_id,
        toId: applicationObject.leaderId as number,
        groupId: applicationObject?.groupId as number,
        type: 'add',
        message: verificationInfo.value,
      }
      websocket.send('addGroup', info)
    } else {
      const info: AddContactApplicationInfoType = {
        fromId: store.user_id,
        toId: applicationObject?.userId as number,
        type: 'add',
        message: verificationInfo.value,
        friendGroupId: applyGroup.value,
        remarks: applyRemarks.value,
      }
      websocket.send('addContact', info)
    }
    ElMessage.success(TIP_TYPE.APPLY_SUCCESS)
    addVaalidateVisible.value = false
  }

  // 上传群聊头像
  const listenAvatarChange = async (uploadFile: UploadFile) => {
    if (uploadFile.status === 'ready') {
      const res: any = await fileUpload.singleFileUpload('avatar', uploadFile.raw)
      switch (res.status) {
        case 0:
          ElMessage.error(TIP_TYPE.UPLOAD_AVATAR_FAIL)
          break
        case 1:
          ElMessage.success(TIP_TYPE.UPLOAD_AVATAR_SUCCESS)
          createGroupInfo.avatarUrl = res.fileInfo.url
          chooseAvatarId.value = -1
          break
        case 2:
          ElMessage.error(TIP_TYPE.IMAGE_MIMETYPE_ERROR)
      }
    }
  }

  // 选择默认头像
  const listenChooseAvatar = (id: number, url: string) => {
    chooseAvatarId.value = id
    createGroupInfo.avatarUrl = url
  }

  // 选择好友(邀请)
  const listenChooseContact = (id: number) => {
    const index = createGroupInfo.members.findIndex((item: number) => item === id)
    if (index === -1) {
      createGroupInfo.members.push(id)
    } else {
      createGroupInfo.members.splice(index, 1)
    }
  }

  // 确定创建群聊
  const listenConfirmCreateGroup = async () => {
    if (!createGroupInfo.name) {
      ElMessage.error(TIP_TYPE.GROUP_NAME_IS_NOT_NULL)
    } else if (!createGroupInfo.avatarUrl) {
      ElMessage.error(TIP_TYPE.GROUP_AVATAR_IS_NOT_NULL)
    } else {
      // 自己也是群成员，要加入
      createGroupInfo.members.unshift(store.user_id)
      const { data } = await createGroup(createGroupInfo)
      if (data.status) {
        ElMessage.success(TIP_TYPE.CREATE_GROUP_SUCCESS)
        createGroupVisible.value = false
        // 更新群聊列表
        store.isUpdateGroupList = true
        // 发送到websocket服务器
        websocket.send('createGroup', {
          userId: createGroupInfo.leaderId,
          groupId: data.groupId,
          members: createGroupInfo.members,
        })
      } else {
        ElMessage.error(TIP_TYPE.CREATE_GROUP_ERROR)
      }
    }
  }

  // 取消创建群聊
  const listenCancleCreteGroup = () => {
    createGroupVisible.value = false
  }
</script>

<style scoped lang="less">
  .add-operation-container {
    position: relative;
    .add-operation-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #fff;
      cursor: pointer;
      &:hover {
        background-color: var(--mouse-hover-active);
      }
    }
    .add-operation-menu {
      position: absolute;
      top: 35px;
      left: 50%;
      transform: translateX(-50%);
      width: 140px;
      padding: 5px 0;
      box-sizing: border-box;
      background-color: #fff;
      z-index: 100;
      border-radius: 4px;
      box-shadow: var(--el-box-shadow);
      .add-operation-menu-item {
        display: flex;
        align-items: center;
        padding: 10px 20px;
        box-sizing: border-box;
        &:hover {
          background-color: var(--mouse-hover-active);
          cursor: pointer;
        }
      }
    }
    .add-contact-group {
      .add-contact-group-search {
      }
    }
    .add-contact-group-result {
      .add-contact-group-result-scroll {
        height: 350px;
        padding: 15px 10px;
        box-sizing: border-box;
        .add-contact-group-result-list {
          .add-contact-group-result-list-item {
            display: flex;
            align-items: center;
            padding: 10px 0;
            box-sizing: border-box;
            .avatar {
              width: 40px;
              height: 40px;
              margin-right: 15px;
            }
            .desc {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              .name-tag {
                display: flex;
                height: 20px;
                line-height: 20px;
                flex: 1;
                .name {
                  font-weight: bold;
                }
              }
              .signature {
                flex: 1;
                height: 20px;
                line-height: 20px;
                font-size: var(--small-desc-size);
                color: var(--desc-color);
              }
            }
            .op {
              width: fit-content;
              height: 24px;
              .no-add {
                .icon {
                  width: 24px;
                  height: 24px;
                }
              }
              .added {
                cursor: default;
              }
            }
          }
        }
        .add-contact-group-no-result {
          display: flex;
          justify-content: center;
          margin-top: 20px;
          color: var(--desc-color);
          font-size: var(--title-font-size);
        }
      }
    }
    .add-apply-info {
      .add-apply-contact {
        display: flex;
        margin-bottom: 20px;
        .avatar {
        }
        .info {
          height: 40px;
          margin-left: 15px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .name {
            height: 20px;
            line-height: 20px;
            font-weight: bold;
          }
          .signature {
            height: 20px;
            line-height: 20px;
            font-size: var(--small-desc-size);
            color: var(--desc-color);
          }
        }
      }
      .add-apply-verification {
        margin-bottom: 10px;
        .title {
          margin-bottom: 10px;
        }
        .verification-info {
          font-size: 18px;
        }
      }
      .add-apply-group {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .label {
        }
        .select {
        }
      }
      .add-apply-remarks {
        display: flex;
        align-items: center;
        .label {
        }
        .input {
        }
      }
    }
    .create-group {
      .choose-avatar {
        .label {
          margin-bottom: 10px;
        }
        .avatar {
          display: flex;
          align-items: center;
          .upload-avatar {
            width: 122px;
            height: 122px;
            margin-right: 10px;
            .upload {
              width: 100%;
              height: 100%;
              border: 1px dashed var(--el-border-color);
              border-radius: 6px;
              cursor: pointer;
              position: relative;
              overflow: hidden;
              transition: var(--el-transition-duration-fast);
              display: flex;
              justify-content: center;
              align-items: center;
              .avatar {
                width: 100%;
                height: 100%;
              }
              .icon {
                width: 100%;
                height: 100%;
                font-size: 28px;
                color: #8c939d;
              }
              &:hover {
                border-color: var(--el-color-primary);
              }
            }
          }
          .default-avatar {
            flex: 1;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            align-content: space-between;
            .item {
              cursor: pointer;
              position: relative;
              .choose {
                position: absolute;
                top: 0;
                left: 0;
                width: 60px;
                height: 60px;
                border: 3px solid var(--avatar-active-border-color);
                box-sizing: border-box;
              }
            }
          }
          &:last-child {
            margin-bottom: 25px;
          }
        }
      }
      .nominate {
        margin-bottom: 20px;
        .label {
          margin-bottom: 10px;
        }
        .name {
        }
      }
      .apply-contact {
        .label {
          margin-bottom: 10px;
        }
        .contact-list-scroll {
          height: 120px;
          .contact-list {
            .contact-list-item {
              display: flex;
              align-items: center;
              padding: 5px;
              box-sizing: border-box;
              .choose-icon {
                font-size: 12px;
                margin-right: 10px;
              }
              .avatar {
                margin-right: 10px;
              }
              .name {
                flex: 1;
              }
              &:hover {
                cursor: pointer;
                background-color: var(--mouse-hover-active);
              }
            }
          }
        }
      }
    }
  }
  :deep(.el-dialog__body) {
    padding: 10px 20px 20px;
  }
  :deep(.el-button) {
    margin-left: 10px !important;
  }
</style>
