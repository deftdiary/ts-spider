import 'reflect-metadata'
import { Request, Response } from 'express'
import { controller, get, post } from '../decorator'
import { getResponseData } from '../utils/util'

interface BodyRequest extends Request {
  body: {[key: string]: string | undefined }
}

// const loginHtml = (
// `<!DOCTYPE html>
// <html>
//   <body style="display:flex;justify-content:center;align-items:center;flex-direction:column;min-height:100vh;">
//     <h2 style="text-align:center;margin-bottom:20px">欢迎来到小站</h2>
//     <form method="post" action="/api/login">
//       <label for="pwInput" >请输入密码:</label>
//       <input type="password" name="password" id="pwInput" />
//       <button>登陆</button>
//     </form>
//   </body>
// </html>`
// )

// const logoutHtml = (
// `<!DOCTYPE html>
// <html>
//   <body style="display:flex;justify-content:center;align-items:center;flex-direction:column;min-height:100vh;">
//     <a href="/getData">启动小蜘蛛</a>
//     <a href="/showData">显示获取数据</a>
//     <a href='/logout'> 退出</a>
//   </body>
// </html>`
// )


@controller('/api')
export class LoginController {

  static isLogin(req: BodyRequest) {
    return !!(req.session ? req.session.login : false)
  }

  @get('/isLogin')
  isLogin(req: BodyRequest, res: Response): void {
    const isLogin = LoginController.isLogin(req)
    res.json(getResponseData(isLogin))
  }

  @post('/login')
  login(req: BodyRequest, res: Response): void {
    const { password } = req.body
    const isLogin = LoginController.isLogin(req)

    if (isLogin) {
      res.json(getResponseData(true))
    } else {
      if (password === '123' && req.session) {
        req.session.login = true
        res.json(getResponseData(true))
      } else {
        res.json(getResponseData(false, '登录失败'))
      }
    }
  }

  @get('/logout')
  logout(req: BodyRequest, res: Response): void {
    if (req.session) {
      req.session.login = undefined
    }
    res.json(getResponseData(true))
  }

  // @get('/')
  // home(req: BodyRequest, res: Response): void {
  //   const isLogin = LoginController.isLogin(req)
  //   if (isLogin) {
  //     res.send(logoutHtml)
  //   } else {
  //     res.send(loginHtml)
  //   }
  // }
}
