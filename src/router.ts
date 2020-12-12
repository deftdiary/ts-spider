import fs from 'fs'
import path from 'path'
import { Router, Request, Response, NextFunction } from 'express'
import Spider from './utils/spider'
import Anaylyzer from './utils/analyzer'
import { getResponseData } from './utils/util';


interface BodyRequest extends Request {
  body: {[key: string]: string | undefined }
}

const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false
  if (isLogin) {
    next()
  } else {
    res.json(getResponseData(null, '请先登录'))
  }
}

const router = Router()

const loginHtml = (
`<!DOCTYPE html>
<html>
  <body style="display:flex;justify-content:center;align-items:center;flex-direction:column;min-height:100vh;">
    <h2 style="text-align:center;margin-bottom:20px">欢迎来到小站</h2>
    <form method="post" action="/login">
      <label for="pwInput" >请输入密码:</label>
      <input type="password" name="password" id="pwInput" />
      <button>登陆</button>
    </form>
  </body>
</html>`
)

const logoutHtml = (
`<!DOCTYPE html>
<html>
  <body style="display:flex;justify-content:center;align-items:center;flex-direction:column;min-height:100vh;">
    <a href="/getData">启动小蜘蛛</a>
    <a href="/showData">显示获取数据</a>
    <a href='/logout'> 退出</a>
  </body>
</html>`
)

router.get('/', (req: Request, res: Response) => {
  res.redirect(302, '/login')
})

router.get('/login', (req: Request, res: Response) => {
  const isLogin = req.session ? req.session.login : undefined
  if (isLogin) {
    res.send(logoutHtml)
  } else {
    res.send(loginHtml)
  }
})

router.get('/logout', (req: BodyRequest, res: Response) => {
  if (req.session) {
    req.session.login = undefined
  }
  res.json(getResponseData(true))
})

router.post('/login', (req: BodyRequest, res: Response) => {
  const { password }  = req.body
  const isLogin = req.session ? req.session.login : undefined

  if (isLogin) {
    res.json(getResponseData(false, '已经登录过了'))
  } else {
    if (password === '123' && req.session) {
      req.session.login = true
      res.json(getResponseData(true))
    } else {
      res.json(getResponseData(false, '登录失败'))
    }
  }
})

router.get('/getData', checkLogin, (req: BodyRequest, res: Response) => {
  const url = `http://top.sogou.com/hot/shishi_1.html`.trim()
  const anaylyzer = Anaylyzer.getInstance()
  new Spider(url, anaylyzer)
  res.json(getResponseData(true))
})

router.get('/showData', checkLogin, (req: BodyRequest, res: Response) => {
  try {
    const position = path.resolve(__dirname, '../data/result.json')
    const result = fs.readFileSync(position, 'utf-8')
    res.json(getResponseData(JSON.parse(result)))
  } catch (e) {
    res.json(getResponseData(false, '数据不存在'))
  }
})

export default router
