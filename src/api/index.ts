import $axios from '@/utils/axios'

export default {
  // 获取数据
  getList(params?: object): Promise<any> {
    return $axios.get('https://randomuser.me/api', params)
  }
}
