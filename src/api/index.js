import $axios from '@/utils/axios'

export default {
  getList(params) {
    return $axios.get('https://randomuser.me/api', params)
  }
}
