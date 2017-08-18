// import * as path from "path"
// import * as loaderUtils from "loader-utils"

export default function() {
  const loader = this as any

  loader.cacheable && loader.cacheable();
  loader.addDependency(loader.resourcePath);

  // const callback = loader.async();

  // const creator = new DtsCreator(options);

  // creator.create(..., source) tells the module to operate on the
  // source variable. Check API for more details.
  // creator.create(loader.resourcePath, source).then(content => {
  //   // Emit the created content as well
  //   loader.emitFile(path.relative(loader.options.context, content.outputFilePath), content.contents || [''], map);
  //   content.writeFile().then(_ => {
  //     callback(null, source, map);
  //   });
  // });
  console.log(loader)
};
