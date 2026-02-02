import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

const essentialDataResponse = async <T>(promiseResponse: Promise<AxiosResponse<T, any>>) => {
  const response = await promiseResponse
  return { status: response.status, data: response.data }
}

const restClient = {
  get: async <T>(url: string, params?: any) => {
    return essentialDataResponse(axios.get<T>(url, { params }))
  },
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return essentialDataResponse(axios.post<T>(url, data, config))
  },
}

export default restClient