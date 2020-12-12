import { Router, Request, Response } from 'express'
import Spider from './spider'
import Anaylyzer from './analyzer'
import fs from 'fs'
import path from 'path'

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined
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

router.get('/logout', (req: RequestWithBody, res: Response) => {
  if (req.session) {
    req.session.login = undefined
  }
  res.redirect('/login')
})

router.post('/login', (req: RequestWithBody, res: Response) => {
  const { password }  = req.body
  const isLogin = req.session ? req.session.login : undefined

  if (isLogin) {
    res.redirect('/login')
  } else {
    if (password === '123' && req.session) {
      req.session.login = true
      res.send('登陆成功')
    } else {
      res.send('登陆失败')
    }
  }
})

router.get('/getData', (req: RequestWithBody, res: Response) => {
  const isLogin = req.session ? req.session.login : false
  if (isLogin) {
    const url = `http://top.sogou.com/hot/shishi_1.html`.trim()
    const anaylyzer = Anaylyzer.getInstance()
    new Spider(url, anaylyzer)
    res.send('🕷️ 小蜘蛛获取数据成功')
  } else {
    res.send('请登陆后再使用小蜘蛛🕷️ ')
  }
})

router.get('/showData', (req: RequestWithBody, res: Response) => {
  const isLogin = req.session ? req.session.login : false
  if (isLogin) {
    try{
      const position = path.resolve(__dirname, '../data/result.json')
      const result = fs.readFileSync(position, 'utf-8')
      res.json(JSON.parse(result))
    }catch(e){
      res.send('尚未爬取到数据')
    }
  } else {
    res.send('用户尚未登陆')
  }
})

export default router
