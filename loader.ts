// import * as path from "path"
import parser from "./parser"
import { writeFile } from "fs"
import { promisify } from "util"
import { loader } from "webpack"

const write = promisify(writeFile)

export default function(this: loader.LoaderContext, source: string, map: any) {
  const loader = this

  loader.cacheable && loader.cacheable();
  loader.addDependency(loader.resourcePath);

  const callback = loader.async();

  parser(source)
    .then(declaration => {
      write(`${loader.resourcePath}.d.ts`, declaration)
      callback && callback(null, source, map)
    })
    .catch(err => {
      loader.emitError(err)
      callback && callback(null, source, map)
    })
};
