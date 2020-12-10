import superagent from 'superagent'
import fs from 'fs'
import path from 'path'
import Anaylyzer from './analyzer'

export interface Analyzer {
  analyze: (html: string, filePath: string) => string
}

class Spider {
  constructor(private url: string, private analyzer: Analyzer) {
    this.initSipder()
  }
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

const url = `http://top.sogou.com/hot/shishi_1.html`.trim()
const anaylyzer = new Anaylyzer()
new Spider(url, anaylyzer)
