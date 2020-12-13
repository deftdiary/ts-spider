import express from 'express'
import bodyParser from 'body-parser'
import cookieSesstion from 'cookie-session'
import './controller/LoginController'
import './controller/SpiderController'
import router from './router'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  cookieSesstion({
    name: 'session',
    keys: ['deft liang'],
    maxAge: 24 * 60 * 60 * 1000
  })
)
app.use(router)

app.listen(7001, () => {
  console.log('server is running')
})
