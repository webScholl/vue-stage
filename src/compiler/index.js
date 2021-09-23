import { parserHTML } from './parser'
export function compileToFunction(template) {
  // 将模版解析成ast语法树
  let ast = parserHTML(template)
  console.log(ast)
  return function () {

  }
}