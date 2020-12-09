import superagent from 'superagent'
import cheerio from 'cheerio'

class Spider {
  constructor() {
    this.getRawHtml()
  }
  private url = `http://www.dell-lee.com/`.trim()
  async getRawHtml() {
    const ret = await superagent.get(this.url)
    this.getHotSearchInfo(ret.text)
  }
  async getHotSearchInfo(html: string) {
    const $ = cheerio.load(html)
    const rank = $('.course-item')
    rank.map((index, el) => {
      console.log(index)
      const txt = $(el).text()
      console.log(txt)
    })
  }
}

const spider = new Spider()
