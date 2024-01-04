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

export const xhrProgress: IMiddlewareHandler<IPayload> = async (ctx, next, config) => {
  if (typeof window === 'undefined') throw new Error('This is a browser middleware')
  ctx.response = await fetch(ctx, config?.payload || {})
  await next()
}

export class HttpSvcXhrProgress extends HttpSvcMiddleware<IPayload> {
  static handler = xhrProgress
  name = 'XHR_PROGRESS'
  constructor() {
    super(xhrProgress)
  }
}
