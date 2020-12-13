import { SpiderController, LoginController } from '../controller'

export enum Methods {
  get = 'get',
  post = 'post',
  put = 'put',
  del = 'delete'
}

function getRequestDecorator(type: Methods) {
  return function (path: string) {
    return function (target: SpiderController | LoginController, key: string) {
      Reflect.defineMetadata('path', path, target, key)
      Reflect.defineMetadata('method', type, target, key)
    }
  }
}

export const get = getRequestDecorator(Methods.get)
export const post = getRequestDecorator(Methods.post)

