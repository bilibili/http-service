import { HttpService, BUILT_IN_MIDDLEWARE } from 'http-svc'
import { HttpSvcMiddleware } from '@http-svc/middleware'
import type {
  UniosInstance as IUniosInstance,
  UniosPromise,
  UniosRequestConfig,
  UniosStatic,
  UniosConfig,
  IRequestInstance
} from './index.d'

interface UniosResetPayload {
  timeout?: number
  signal?: AbortSignal
}

const UNIOS_MIDDLEWARE = {
  RESET: 'UNIOS_RESET',
  ADAPTER_FETCH: 'UNIOS_ADAPTER_FETCH'
}
class UniosResetMiddleware extends HttpSvcMiddleware<UniosResetPayload> {
  name = UNIOS_MIDDLEWARE.RESET
  constructor(payload: UniosResetPayload) {
    super({
      async handler(ctx, next, config) {
        const { timeout, signal } = config?.payload || {}
        ctx.config.timeout = timeout
        if (signal) {
          ctx.abortController = {
            abort() {
              // nothing
            },
            signal
          }
        }
        await next()
      },
      payload: {
        // 默认8秒超时
        timeout: payload.timeout || 8000
      }
    })
  }
}

function Unios(this: IUniosInstance, cls: typeof HttpService, config?: UniosConfig) {
  this.service = new cls({
    fetch: config?.fetch,
    baseURL: config?.baseURL,
    middlewares: [new UniosResetMiddleware({ timeout: config?.timeout }), ...(config?.middlewares || [])]
  })
}

Unios.prototype.request = function <T>(config: UniosRequestConfig): UniosPromise<T> {
  let reqInst: IRequestInstance = this.service
  if (config.chainProxy) {
    try {
      reqInst = config.chainProxy(this.service)
    } catch (error: any) {
      console.warn('chainProxy error:', error?.message)
    }
  }

  const { baseURL, url, method, params, data, headers, timeout, signal, withCredentials, responseType } = config

  if (signal) {
    // TODO: httpsvc 支持disable timeout
    reqInst = reqInst.disable(BUILT_IN_MIDDLEWARE.TIMEOUT)
  }

  return reqInst
    .with(UNIOS_MIDDLEWARE.RESET, {
      timeout,
      signal
    })
    .with(BUILT_IN_MIDDLEWARE.RES_DATA, {
      type: responseType || 'json'
    })
    .request({
      url,
      baseURL: (baseURL || this.service.baseURL) as any,
      params,
      data,
      method,
      headers,
      credentials: withCredentials === false ? 'omit' : 'include'
    })
}
Unios.prototype.get = function <T = unknown>(url: string, config?: UniosRequestConfig): UniosPromise<T> {
  return this.request({
    ...(config || {}),
    url
  })
}
Unios.prototype.post = function <T = unknown>(url: string, data?: any, config?: UniosRequestConfig): UniosPromise<T> {
  return this.request({
    ...(config || {}),
    url,
    data: data || config?.data
  })
}

// ++++++++++++++++++++++++++++++++++++ Utils START +++++++++++++++++++++++++++++++++++++++++++
function isArray(val) {
  return toString.call(val) === '[object Array]'
}
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj]
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (let i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj)
    }
  } else {
    // Iterate over object keys
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj)
      }
    }
  }
}

/**
 * 扩展对象，迁移自axios源码
 * @param a
 * @param b
 * @param thisArg
 * @returns
 */
function extend(a, b, thisArg?: any) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg)
    } else {
      a[key] = val
    }
  })
  return a
}

/**
 * 绑定参数给特定指针，迁移自axios源码
 * @param a
 * @param b
 * @param thisArg
 * @returns
 */
function bind(fn, thisArg) {
  return function wrap() {
    const args = new Array(arguments.length)
    for (let i = 0; i < args.length; i++) {
      // eslint-disable-next-line prefer-rest-params
      args[i] = arguments[i]
    }
    return fn.apply(thisArg, args)
  }
}

// ++++++++++++++++++++++++++++++++++++ Utils END +++++++++++++++++++++++++++++++++++++++++++

function create(config?: UniosConfig, cls?: typeof HttpService) {
  const context = new Unios(cls || HttpService, config)
  const instance = bind(Unios.prototype.request, context) as any
  // Copy unios.prototype to instance
  extend(instance, Unios.prototype, context)
  // Copy context to instance
  extend(instance, context)

  return instance as UniosStatic
}
const unios = create()
unios.create = create
export default unios
