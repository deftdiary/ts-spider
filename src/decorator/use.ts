import 'reflect-metadata'
import { RequestHandler } from 'express'
import { SpiderController, LoginController } from '../controller'

export function use(middleware: RequestHandler) {
  return function (target: SpiderController | LoginController, key: string) {
    const originMiddlewares: RequestHandler[] = Reflect.getMetadata('middlewares', target, key) || []
    originMiddlewares.push(middleware)
    Reflect.defineMetadata('middlewares', originMiddlewares, target, key)
  }
}
