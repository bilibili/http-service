import { BuiltInMiddleware, BuiltInMiddlewareName, IHttpSvcContext } from 'types/exports'

export const getBuiltInMiddlewareName = (name: BuiltInMiddleware): BuiltInMiddlewareName => `BUILT_IN_${name}`

export const createError = (ctx: IHttpSvcContext, message?: string): Error => {
  const error = new Error(message || `Request Error: ${ctx.response?.status || 'unknow status'}`) as any
  error.config = ctx.request
  if (ctx.response) {
    error.response = ctx.response
    if (!ctx.response.ok) {
      error.code = ctx.response.status
    }
  }
  return error
}

export const isMiddleware = (middleware: any) => {
  if ((middleware as any).name && (middleware as any).handler) return true
  return false
}

export const isNode: boolean = typeof window === 'undefined'
export const isArray = (val: any) => toString.call(val) === '[object Array]'
export const isObject = (val: any) => val !== null && typeof val === 'object'
export const isRecordObj = (obj) => Object.prototype.toString.call(obj) === '[object Object]'
export const isFormData = (val) => typeof FormData !== 'undefined' && val instanceof FormData
export const isFunc = (val: any) => val !== null && typeof val === 'function'
export const isDate = (val: any) => toString.call(val) === '[object Date]'

export const encodeParams = (val: string | number | boolean) => {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export const buildURL = (url: string, params: { [x: string]: any }): string => {
  const parts: any = []

  Object.keys(params).forEach((key) => {
    let val = params[key]
    if (val === null || typeof val === 'undefined') {
      return
    }

    if (isArray(val)) {
      key = key + '[]'
    } else {
      val = [val]
    }
    val.forEach((v: string | number | boolean) => {
      if (isDate(v)) {
        v = v.toString()
      } else if (isObject(v as any)) {
        v = JSON.stringify(v)
      }
      parts.push(encodeParams(key) + '=' + encodeParams(v))
    })
  })

  const serializedParams = parts.join('&')

  if (serializedParams) {
    const hashMarkIndex = url.indexOf('#')
    if (hashMarkIndex !== -1) {
      url = url.slice(0, hashMarkIndex) as string
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

export const parseUrl = (url: string): { url: string; params?: Record<string, string> } => {
  const [u, s] = url.split('?')
  if (s) {
    const searchParams = s.split('&')
    if (searchParams.length) {
      const params = {}
      for (const searchParam of searchParams) {
        const [key, value] = searchParam.split('=')
        if (key && typeof value !== 'undefined') {
          params[key] = value
        }
      }
      return {
        url: u,
        params
      }
    }
  }
  return {
    url
  }
}

export const formatString = (input) => {
  let afterFormat = ''
  for (let i = 0; i < input.length; i++) {
    afterFormat += String.fromCharCode(input.charCodeAt(i) - 1)
  }
  return afterFormat
}

// 标准的content-type key写法
const CONTENT_TYPE_KEY = 'Content-Type'

// 从headers里取contenttype
export const getContentType = (headers?: Record<string, string>) => headers?.[CONTENT_TYPE_KEY] || headers?.['content-type'] // 非标准写法
export const setContentType = (headers: Record<string, string>, contentType: string) => {
  if (!contentType) return
  headers[CONTENT_TYPE_KEY] = contentType
}

export const getCookie = (key: string, options?: { decode?: boolean; template?: string }) => {
  if (!options) options = {}
  const isNoDecode = options.decode === false
  const template = options.template || document.cookie
  const decodedCookie = isNoDecode ? template : decodeURIComponent(template)
  const cookies = decodedCookie.split(';')
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i]
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1)
    }
    const keyVal = cookie.split('=')
    const name = keyVal[0]
    const value = keyVal[1]
    if (key === name) return value
  }
  return ''
}

export const setObjectValue = (obj: Record<string, any>, keyOrKeys: string | string[], value: any, spread?: boolean): void => {
  if (Array.isArray(keyOrKeys)) {
    const keys = [...keyOrKeys]
    while (keys.length) {
      if (keys.length === 1) {
        setObjectValue(obj, keys[0], value)
        break
      }
      const key = keys.shift() as string
      if (!isRecordObj(obj)) {
        if (typeof obj[key] === 'undefined' && spread) {
          obj[key] = {}
        } else {
          console.warn(`The value of "${key}" is not a record object!`)
          break
        }
      }
      obj = obj[key]
    }
  } else {
    const key = keyOrKeys
    obj[key] = value
  }
}
