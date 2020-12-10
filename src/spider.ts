import superagent from 'superagent'
import cheerio from 'cheerio'

class Spider {
  constructor() {
    this.getRawHtml()
  }
  private url = `http://top.sogou.com/hot/shishi_1.html?fr=tph_righ/`.trim()
  async getRawHtml() {
    const ret = await superagent.get(this.url)
    this.getHotSearchInfo(ret.text)
  }
  async getHotSearchInfo(html: string) {
    const $ = cheerio.load(html)
    const arr: string[] = []
    const rank1 = $('.pub-list .p2')
    rank1.map((index, el) => {
      let txt = $(el).text().trim()
      txt = txt.split('...')[0] + '...'
      arr.push(txt)
    })
    const rank2 = $('.pub-list .p3')
    rank2.map((index, el) => {
      const txt = $(el).text().trim()
      arr.push(txt)
    })
    console.log(arr.join('\n')) // df-log
  }
}

const spider = new Spider()
