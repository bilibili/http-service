import { BuiltInMiddlewareName, BuiltInMiddleware } from 'types/exports'
import { getBuiltInMiddlewareName } from '../shared'

export const BUILT_IN_MIDDLEWARE: Record<BuiltInMiddleware, BuiltInMiddlewareName> = {
  INIT_CTX: getBuiltInMiddlewareName('INIT_CTX'),
  TIMEOUT: getBuiltInMiddlewareName('TIMEOUT'),
  BODY: getBuiltInMiddlewareName('BODY'),
  XSRF: getBuiltInMiddlewareName('XSRF'),
  FETCH: getBuiltInMiddlewareName('FETCH'),
  RETRY: getBuiltInMiddlewareName('RETRY'),
  SPRAY: getBuiltInMiddlewareName('SPRAY'),
  RES_DATA: getBuiltInMiddlewareName('RES_DATA'),
  RES_EXTRACT: getBuiltInMiddlewareName('RES_EXTRACT'),
  LOG: getBuiltInMiddlewareName('LOG'),
  CACHE: getBuiltInMiddlewareName('CACHE')
}

export const ORDER_PRIFIX = '$ORDER_'
