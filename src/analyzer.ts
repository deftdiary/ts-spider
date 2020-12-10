import fs from 'fs'
import cheerio from 'cheerio'
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

export default class Anaylyzer {
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

  generateJsonRet(jsonRet: JsonProps, filePath: string) {
    let fileContent: ContentProps = {}
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    fileContent[jsonRet.time] = jsonRet.data
    return fileContent
  }
  public analyze(html: string, filePath: string) {
    const jsonRet = this.getHotSearchInfo(html)
    const fileContent = this.generateJsonRet(jsonRet, filePath)
    return JSON.stringify(fileContent)
  }
}