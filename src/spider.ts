import superagent from 'superagent'
import fs from 'fs'
import path from 'path'

export interface Analyzer {
  analyze: (html: string, filePath: string) => string
}

export default class Spider {
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

  private writeFile(content: string) {
    try {
      fs.writeFileSync(this.filePath, content)
    } catch (e) {
      console.log(e) // df-log
    }
  }
}
