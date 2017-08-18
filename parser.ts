import * as css from 'css'
import * as stylus from 'stylus'
import * as util from 'util'
import * as fs from 'fs'

const readFile = util.promisify(fs.readFile)
const parseStylus = (sourceCode: string): Promise<string> => new Promise((resolve, reject) => {
  stylus.render(sourceCode, {}, (err, css) => err ? reject(err) : resolve(css))
})

async function getStylusAST(path: string): Promise<css.Rule[] | null> {
  try {
    const content = (await readFile(path)).toString()
    const cssCode = await parseStylus(content)
    const result = css.parse(cssCode)

    return result.stylesheet !== undefined
      ? result.stylesheet.rules as css.Rule[]
      : null
  }

  catch (e) {
    console.error(e)
    return null
  }
}

const validSelector = /(\.[\S]+)/
const className = /\.\w+/
const isClassName =(s: string) => s.indexOf(":") === -1 && className.test(s)

async function parse(path: string) {
  const rules = await getStylusAST(path)

  if (rules === null) return null

  const options: Record<string, string[]> = {}

  for(let i = 0; i < rules.length; i++) {
    const rule = rules[i]

    if (rule.selectors !== undefined)
      rule.selectors
        .filter(s => validSelector.test(s))
        .forEach(selector => {
          const classNames = selector.split(" ").filter(isClassName)
          let className = classNames.pop()

          if (className === undefined)
            return;

          else if (!className.startsWith("."))
            className = className.substr(className.indexOf("."))

          const classes = className.split(".").slice(1)
          const root = classes[0]
          const modifiers = classes.slice(1)

          if (options[root] === undefined)
            options[root] = modifiers || [];

          else if (modifiers.length > 0)
            modifiers.forEach(m => options[root].indexOf(m) === -1 && options[root].push(m))

          classNames.forEach(c => {
            const cName = c.slice(1)
            if (c && c.startsWith(".") && !options[cName])
              options[cName] = []
          })
        })
  }

  const declaration = Object.keys(options).reduce(
    (d, selector) => {
      const modifiers = options[selector].map(s => `"${s}"?: boolean`).join(",\n")
      const args = modifiers.length ? `modifiers?: { ${modifiers} }` : ""

      return d.concat(`\t"${selector}": (${args}) => string,\n`)
    },
    "declare const styles: {\n"
  )

  return `${declaration}}

export = styles`
}

const start = async (path: string) => await parse(path)

export default start
