import axios, { AxiosError } from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ResponseData } from './type'
import { ErrorDataImp } from '@server/api'
import { ElMessage } from 'element-plus'

const noon = <T>(res: T): T => res

export interface RequestInterceptors {
  // 请求拦截
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorsCatch?: (err: AxiosError<any, ErrorDataImp>) => any
  // 响应拦截
  responseInterceptors?: <T = AxiosResponse>(config: T) => T
  responseInterceptorsCatch?: (err: AxiosError<ErrorDataImp, any>) => any
}
// 自定义传入的参数
export interface RequestConfig extends AxiosRequestConfig {
  interceptors?: RequestInterceptors
}
interface RequestData<T> extends RequestConfig {
  data?: T
}

export interface CancelRequestSource {
  [index: string]: () => void
}

class Request {
  /*
  存放取消方法的集合
  * 在创建请求后将取消请求方法 push 到该集合中
  * 封装一个方法，可以取消请求，传入 url: string|string[] 
  * 在请求之前判断同一URL是否存在，如果存在就取消请求
  */
  cancelRequestSourceList?: CancelRequestSource[]
  /*
  存放所有请求URL的集合
  * 请求之前需要将url push到该集合中
  * 请求完毕后将url从集合中删除
  * 添加在发送请求之前完成，删除在响应之后删除
  */
  requestUrlList?: string[]

  private instance: AxiosInstance
  private interceptorsObj: RequestInterceptors = {}
  constructor(config: RequestConfig) {
    this.instance = axios.create(config)
    if (config?.interceptors) {
      this.interceptorsObj = config.interceptors
      // 使用全局拦截器
      this.useIntercepetor()
    }
  }
  useIntercepetor(
    instance = this.instance,
    interceptorsObj = this.interceptorsObj,
  ) {
    const {
      requestInterceptors = noon,
      requestInterceptorsCatch = noon,
      responseInterceptors = noon,
      responseInterceptorsCatch = noon,
    } = interceptorsObj

    instance.interceptors.request.use(
      requestInterceptors,
      requestInterceptorsCatch,
    )
    instance.interceptors.response.use(
      responseInterceptors,
      responseInterceptorsCatch,
    )
  }
  /**
   * @description: 获取指定 url 在 cancelRequestSourceList 中的索引
   * @param {string} url
   * @returns {number} 索引位置
   */
  private getSourceIndex(url: string): number {
    return this.cancelRequestSourceList?.findIndex(
      (item: CancelRequestSource) => {
        return Object.keys(item)[0] === url
      },
    ) as number
  }
  /**
   * @description: 删除 requestUrlList 和 cancelRequestSourceList
   * @param {string} url
   * @returns {*}
   */
  private delUrl(url: string) {
    const urlIndex = this.requestUrlList?.findIndex(u => u === url)
    const sourceIndex = this.getSourceIndex(url)
    // 删除url和cancel方法
    urlIndex !== -1 && this.requestUrlList?.splice(urlIndex as number, 1)
    sourceIndex !== -1 &&
      this.cancelRequestSourceList?.splice(sourceIndex as number, 1)
  }
  // 取消全部请求
  cancelAllRequest() {
    this.cancelRequestSourceList?.forEach(source => {
      const key = Object.keys(source)[0]
      source[key]()
    })
  }
  // 取消请求
  cancelRequest(url: string | string[]) {
    if (typeof url === 'string') {
      // 取消单个请求
      const sourceIndex = this.getSourceIndex(url)
      sourceIndex >= 0 && this.cancelRequestSourceList?.[sourceIndex][url]()
    } else {
      // 存在多个需要取消请求的地址
      url.forEach(u => {
        const sourceIndex = this.getSourceIndex(u)
        sourceIndex >= 0 && this.cancelRequestSourceList?.[sourceIndex][u]()
      })
    }
  }

  // 设置请求
  async request<T = any, D = any>(
    config: RequestData<D>,
  ): Promise<ResponseData<T>> {
    const { method = 'GET' } = config
    if (method.toUpperCase() === 'GET') config.params = config.data
    const url = config.url
    // url存在保存取消请求方法和当前请求url
    if (url) {
      this.requestUrlList?.push(url)
      config.cancelToken = new axios.CancelToken(c => {
        this.cancelRequestSourceList?.push({
          [url]: c,
        })
      })
    }
    if (config.interceptors?.requestInterceptors) {
      config = config.interceptors.requestInterceptors(config)
    }
    const res = await this.instance.request<ResponseData<T>>(config)
    try {
      if (config.interceptors?.responseInterceptors) {
        return (await config.interceptors.responseInterceptors(res)) as any
      }
    } catch (error: any) {
      throw new Error(error)
    } finally {
      url && this.delUrl(url)
    }
    return res.data
  }
}
export default new Request({
  baseURL: import.meta.env.PROD
    ? import.meta.env.VITE_APP_API_BASE_URL
    : '/api',
  timeout: 1000 * 60 * 5,
  interceptors: {
    // 请求拦截器
    requestInterceptors: config => {
      // console.log('实例请求拦截器')

      return config
    },
    // 响应拦截器
    // responseInterceptors: result => {
      // console.log('实例响应拦截器')
    //   return result
    // },
    responseInterceptorsCatch(err) {
      switch (err.response?.status) {
        case 403:
          if (err.response?.data?.error) {
            ElMessage({
              type: 'error',
              message: (err.response?.data?.error as string) ?? '登录失效',
            })
          }

          break
        case 429:
          ElMessage({
            type: 'error',
            message: '请求过于频繁',
          })
          break
      }

      return Promise.reject()
    },
  },
})

