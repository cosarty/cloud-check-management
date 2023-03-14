import { UserType } from '@server/api'
import http from '../http'

const uploadAvatar = () =>
  http.request({ url: '/upload/userAvatarDir', method: 'post' })
