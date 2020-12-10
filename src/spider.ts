import superagent from 'superagent'
import fs from 'fs'
import path from 'path'
import Anaylyzer from './analyzer'

class Spider {
  constructor(private analyzer: any) {
    this.initSipder()
  }
  private url = `http://top.sogou.com/hot/shishi_1.html`.trim()
  private filePath = path.resolve(__dirname, '../data/result.json')

  private async initSipder() {
    const html = await this.getRawHtml()
    const fileContent = this.analyzer.analyze(html, this.filePath)
    this.writeFile(fileContent)
  }

  private async getRawHtml() {
    const html = await superagent.get(this.url)
    return html.text
  }

  writeFile(content: string) {
    fs.writeFileSync(this.filePath, content)
  }
}

const anaylyzer = new Anaylyzer()
const spider = new Spider(anaylyzer)
