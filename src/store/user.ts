import { computed, ComputedRef, ref } from 'vue'

import { request } from '../services'
import storage from '../utils/storage'

export default function useUser () {
  const user = ref<User | null>(storage.get<User>('user'))

  const isAuthorized = (user: ComputedRef<User | null>): user is ComputedRef<User> => {
    return user.value !== null
  }

  const updateUser = (userData: User | null): void => {
    if (userData === null) {
      storage.remove('user')
      request.deleteAuthorizationHeader()
      user.value = null
    } else {
      storage.set('user', userData)
      request.setAuthorizationHeader(userData.token)
      user.value = userData
    }
  }

  return {
    user: computed(() => user.value),
    isAuthorized,
    updateUser,
  }
}