import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const IdKey = 'id'

const UserNameKey = 'username'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getId() {
  return Cookies.get(IdKey)
}

export function getUserName() {
  return Cookies.get(UserNameKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setId(id) {
  return Cookies.set(IdKey, id)
}

export function setUserName(userName) {
  return Cookies.set(UserNameKey, userName)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeId() {
  return Cookies.remove(IdKey)
}
