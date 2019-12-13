import axios from 'axios'

export function request(config) {
  const instance = axios.create({
    baseURL: 'http://106.54.54.237:8000',
    timeout: 5000
  })
  //axios拦截器
  // instance.interceptors.request.use(res=>{
  //   // console.log(res)
  //   //1.比如config中的一些信息不符合服务器要求
  //   //2.网络请求时，图标过度
  //   //3.网络请求，必须携带特殊信息（比如登录）
  //   return config
  // },error => {
  //   // console.log(error)
  // })
  //响应拦截
  // instance.interceptors.response.use(config=>{
  //   console.log(config)
  //   return config.data
  // },err=>{
  //   console.log(err)
  // })
  //
  // //发送网络请求
  return instance(config)
}