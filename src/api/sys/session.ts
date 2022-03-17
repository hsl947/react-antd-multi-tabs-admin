import $axios from '@/utils/axios'
import { UserInfo } from '@/app_models/user'

export default {
  // 获取数据
  login(params?: object): Promise<UserInfo> {
    return $axios.post('/login', params)
  }
}
