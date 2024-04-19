import type { IMiddlewareHandler } from '@http-svc/middleware/types/middleware'
import type { IHttpSvcContext } from '@http-svc/middleware/types/context'
import { HttpSvcMiddleware } from '@http-svc/middleware'

// 可选
interface IPayload {
  onCreated?: (xhr: XMLHttpRequest) => void
}

function parseHeaders(rawHeaders) {
  const headers = new Headers()
  const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
  preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
    const parts = line.split(':')
    const key = parts.shift().trim()
    if (key) {
      const value = parts.join(':').trim()
      headers.append(key, value)
    }
  })
  return headers
}

function fetch(ctx: IHttpSvcContext, payload: IPayload): Promise<Response> {
  return new Promise(function (resolve, reject) {
    if (!ctx.request) return reject(new Error('Need request config'))
    const { url, method, data, credentials, headers } = ctx.request
    // abort
    const signal = ctx.abortController?.signal
    if (signal?.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    const xhr = new XMLHttpRequest()

    // abort 逻辑
    function abortXhr() {
      xhr.abort()
    }

    xhr.onload = () => {
      resolve(
        new Response(xhr.response || xhr.responseText, {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        })
      )
    }

    xhr.onerror = function () {
      reject(new TypeError('Network request failed'))
    }

    xhr.ontimeout = function () {
      reject(new TypeError('Network request failed'))
    }

    xhr.onabort = function () {
      reject(new DOMException('Aborted', 'AbortError'))
    }

    const { onCreated } = payload

    onCreated?.(xhr)

    xhr.open(method, url, true)

    if (credentials === 'include') {
      xhr.withCredentials = true
    } else if (credentials === 'omit') {
      xhr.withCredentials = false
    }

    if ('responseType' in xhr && window.Blob) {
      xhr.responseType = 'blob'
    }

    if (headers) {
      Object.entries(headers).forEach(function ([name, value]) {
        xhr.setRequestHeader(name, value)
      })
    }

    if (signal) {
      signal.addEventListener('abort', abortXhr)
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          signal.removeEventListener('abort', abortXhr)
        }
      }
    }

    xhr.send(data as XMLHttpRequestBodyInit | null)
  })
}

// 因为这里没有复杂的链式调用，因此不使用async/await而使用promise优化构建
export const xhr: IMiddlewareHandler<IPayload> = (ctx, next, config) => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('This is a browser middleware'))
    fetch(ctx, config?.payload || {})
      .then((response) => {
        ctx.response = response
        next().then(resolve).catch(reject)
      })
      .catch(reject)
  })
}

export class HttpSvcXhr extends HttpSvcMiddleware<IPayload> {
  static handler = xhr
  name = 'XHR'
  constructor() {
    super(xhr)
  }
}
