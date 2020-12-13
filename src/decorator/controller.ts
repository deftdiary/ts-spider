import router from '../router'
import { Methods } from './request'
import { RequestHandler } from 'express'

export function controller(root: string) {
  return function (target: new (...agrs: any[]) => any) {
    for (let key in target.prototype) {
      const handler = target.prototype[key]
      const path: string = Reflect.getMetadata('path', target.prototype, key)
      const method: Methods = Reflect.getMetadata('method', target.prototype, key)
      const middlewares: RequestHandler[] = Reflect.getMetadata('middlewares', target.prototype, key)
      if (path && method) {
        const fullPath: string = root === '/' ? path : `${root}${path}`
        if (middlewares && middlewares.length) {
          router[method](fullPath, ...middlewares, handler)
        } else {
          router[method](fullPath, handler)
        }
      }
    }
  }
}
