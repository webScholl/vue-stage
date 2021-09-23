import { parserHTML } from './parser'
import { generate } from './generate'
export function compileToFunction(template) {
  // 将模版解析成ast语法树
  let ast = parserHTML(template)
  //  生成代码
  let code = generate(ast)
  console.log('code:', code)
  // 生成render
  let render = new Function(`with(this){return ${code}}`)
  console.log('render:', render.toString())
  return render
}