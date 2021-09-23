const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>']+)))?/
const startTagClose = /^\s*(\/?)>/

export function parserHTML(html) {

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)

      let end;
      let attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) { //要有属性 不能为开始的结束标签
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
        advance(attr[0].length)
      }
      if (end) {
        advance(end[0].length)
      }

      return match
    }
  }
  function advance(len) {
    html = html.substring(len)
  }
  function createASTElement(tag, attrs, parent) {
    return {
      tag,
      attrs,
      type: 1,
      parent,
      children: []
    }
  }
  // 我要构建父子关系
  let stack = []
  let root = null

  function start(tagName, attrs) {
    // 遇到开始标签 就取栈中的最后一个作为父节点
    let parent = stack[stack.length - 1]
    let element = createASTElement(tagName, attrs, parent)
    if (root === null) {
      root = element
    }
    if (parent) {
      parent.children.push(element)
    }
    stack.push(element)
  }
  function end() {
    stack.pop()
  }
  function text(chars) {
    let parent = stack[stack.length - 1]
    chars = chars.replace(/\s/g, '')
    if (chars) {
      parent.children.push({
        type: 2,
        text: chars
      })
    }
  }
  // 解析标签和文本
  while (html) {
    let index = html.indexOf('<')
    if (index === 0) { // 解析开始标签 并且把属性也解析出来
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue;
      }
      let endTagMatch
      if (endTagMatch = html.match(endTag)) {
        advance(endTagMatch[0].length)
        end()
        continue;
      }
    }
    if (index > 0) { // 文本
      let chars = html.substring(0, index)
      advance(chars.length)
      text(chars)
    }
  }
  return root
}