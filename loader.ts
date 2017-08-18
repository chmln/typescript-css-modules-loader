// import * as path from "path"
import parser from "./parser"
import { writeFile } from "fs"
import { promisify } from "util"

const write = promisify(writeFile)

export default function(source: any, map: any) {
  const loader = this as any

  loader.cacheable && loader.cacheable();
  loader.addDependency(loader.resourcePath);

  const callback = loader.async();
  parser(loader.resourcePath).then(declaration => {
    write(`${loader.resourcePath}.d.ts`, declaration)
  })

  callback(null, source, map)
};
