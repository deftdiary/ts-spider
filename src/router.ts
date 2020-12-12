import { Router, Request, Response } from 'express'
import Spider from './spider'
import Anaylyzer from './analyzer'

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined
  }
}

const router = Router()

const loginHtml = (
`<!DOCTYPE html>
<html>
  <body style="display:flex;justify-content:center;align-items:center;min-height:100vh;">
    <form method="post" action="/getData">
      <input type="password" name="password" />
      <button>login</button>
    </form>
  </body>
</html>`
)

router.get('/', (req: Request, res: Response) => {
  res.redirect(302, '/login')
})

router.get('/login', (req: Request, res: Response) => {
  res.send(loginHtml)
})

router.post('/getData', (req: RequestWithBody, res: Response) => {
  const { password }  = req.body
  if (password === '123') {
    const url = `http://top.sogou.com/hot/shishi_1.html`.trim()
    const anaylyzer = Anaylyzer.getInstance()
    new Spider(url, anaylyzer)
    res.send('Get Data success')
  } else {
    res.send(`${req.teacherName}Password Error`)
  }
})

export default router
