import * as css from 'css'

async function getAST(cssCode: string): Promise<[Error | null, css.Rule[]]> {
  try {
    const result = css.parse(cssCode)

    return result.stylesheet !== undefined
      ? [null, result.stylesheet.rules as css.Rule[]]
      : [new Error("Error parsing CSS"), []]
  }

  catch (e ) {
    return [e, []]
  }
}

const validSelector = /(\.[\S]+)/
const className = /\.\w+/
const isClassName =(s: string) => s.indexOf(":") === -1 && className.test(s)

async function parse(cssCode: string) {
  const [ error, rules] = await getAST(cssCode)

  if (error !== null) throw error;

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

const start = async (cssCode: string) => await parse(cssCode)

export default start
