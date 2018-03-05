import axios from 'axios'
axios.defaults.timeout = 8000
// code状态码200判断
axios.interceptors.response.use((res) => {
  if (res.status === 654) {
    alert('请求超时！')
  }
  if (res.data.code !== 200) {
    alert('数据返回有误')
    return Promise.reject(res)
  }
  return res
}, (err) => {
  console.log('promise error:' + err)
  return Promise.reject(err)
})
export default axios
