import fs from 'fs'
import path from 'path'
import 'reflect-metadata'
import { Request, Response, NextFunction } from 'express'
import { controller, use, get } from '../decorator'
import { getResponseData } from '../utils/util'
import Spider from '../utils/spider'
import Anaylyzer from '../utils/analyzer'

interface BodyRequest extends Request {
  body: { [key: string]: string | undefined }
}

const checkLogin = (req: Request, res: Response, next: NextFunction): void => {
  const isLogin = !!(req.session ? req.session.login : false)
  if (isLogin) {
    next()
  } else {
    res.json(getResponseData(null, '请先登录'))
  }
}

@controller('/')
export class SpiderController {
  @get('/getData')
  @use(checkLogin)
  getData(req: BodyRequest, res: Response): void {
    const url = `http://top.sogou.com/hot/shishi_1.html`.trim()
    const anaylyzer = Anaylyzer.getInstance()
    new Spider(url, anaylyzer)
    res.json(getResponseData(true))
  }

  @get('/showData')
  showData(req: BodyRequest, res: Response): void {
    try {
      const position = path.resolve(__dirname, '../../data/result.json')
      const result = fs.readFileSync(position, 'utf-8')
      res.json(getResponseData(JSON.parse(result)))
    } catch (e) {
      res.json(getResponseData(false, '数据不存在'))
    }
  }
}
