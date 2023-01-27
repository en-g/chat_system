import { get } from '@/request/index'
import { GetContactsListType } from '@/types/contacts'

const getContactsList = (id: GetContactsListType) => {
  return Promise.resolve(get({ url: `friends/list/${id.userId}` }))
}

const getGroupsList = (id: GetContactsListType) => {
  return Promise.resolve(get({ url: `groups/list/${id.userId}` }))
}

export { getContactsList, getGroupsList }
