export type FetchMethod =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK'
export type FetchCredentials = 'omit' | 'same-origin' | 'include'
export interface IFetchHeaders {
  [key: string]: string
}
export interface IFetchParams {
  [key: string]: string | number | undefined
}
export type IFetchData = BodyInit | Record<string, any>
/**
 * use http policy or not
 * like:
 * 1. '//api.domain.com'
 * 2. 'http://api.domain.com'
 * 3. 'https://api.domain.com'
 */
export type FetchBaseURL = string
/**
 * @file fetch types
 */
export interface IFetchConfig {
  url: string
  /**
   * base URL(host) like '//api.domain.com'
   */
  baseURL?: FetchBaseURL
  /**
   * 请求方法
   */
  method?: FetchMethod
  /**
   * 请求超时时间
   */
  timeout?: number
  /**
   * 请求头
   */
  headers?: IFetchHeaders
  /**
   * 请求凭证
   */
  credentials?: FetchCredentials
  params?: IFetchParams
  data?: IFetchData
}

export type FetchFunction = typeof window.fetch
