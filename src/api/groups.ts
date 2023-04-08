import { get, post } from '@/request'
import { CreateGroupInfoType, GetAllContactType } from '@/types/groups'

const getGroupDefaultAvatrList = () => {
  return Promise.resolve(get({ url: 'groups/defaultAvatar/list/' }))
}

const getAllContact = (id: GetAllContactType) => {
  return Promise.resolve(get({ url: `friends/all/${id.userId}` }))
}

const createGroup = (info: CreateGroupInfoType) => {
  return Promise.resolve(
    post({
      url: 'groups/create',
      data: info,
    })
  )
}

export { getGroupDefaultAvatrList, getAllContact, createGroup }
