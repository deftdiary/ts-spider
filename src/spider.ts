import superagent from 'superagent'
import cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'

interface NewsProps {
  title: string
  desc: string
  rank: number
  search: number
}

interface JsonProps {
  time: number
  data: NewsProps[]
}

interface ContentProps {
  [propName: number]: NewsProps[]
}

class Spider {
  constructor() {
    this.initSipder()
  }
  private url = `http://top.sogou.com/hot/shishi_1.html`.trim()
  private filePath = path.resolve(__dirname, '../data/result.json')

  private async initSipder() {
    const html = await this.getRawHtml()
    const jsonRet = this.getHotSearchInfo(html)
    const fileContent = this.generateJsonRet(jsonRet)
    this.writeFile(JSON.stringify(fileContent))
  }

  private async getRawHtml() {
    const html = await superagent.get(this.url)
    return html.text
  }

  private getHotSearchInfo(html: string) {
    const $ = cheerio.load(html)
    let newsArr: NewsProps[] = []
    const list = $('.pub-list li')
    list.map((_, el) => {
      const news: NewsProps = {
        title: '',
        desc: '',
        rank: -1,
        search: -1
      }
      news.title = $(el).find('.p1').text() ? $(el).find('.p1').text() : $(el).find('.p3').text()
      news.desc = $(el).find('.p2').text()
        ? $(el).find('.p2').text().split('...')[0] + '...'
        : '无描述'
      news.rank = parseInt($(el).find('.s1 i').text())
      news.search = parseInt($(el).find('.s3').text())
      newsArr.push(news)
    })
    const jsonRet: JsonProps = {
      time: Date.now(),
      data: newsArr
    }
    return jsonRet
  }

  generateJsonRet(jsonRet: JsonProps) {
    let fileContent: ContentProps = {}
    if (fs.existsSync(this.filePath)) {
      fileContent = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'))
    }
    fileContent[jsonRet.time] = jsonRet.data
    return fileContent
  }

  writeFile(content: string) {
    fs.writeFileSync(this.filePath, content)
  }
}

const spider = new Spider()
