# typescript-css-modules
Loader to generate typescript declaration files (.d.ts) from css modules

## Installation

`yarn add typescript-css-modules`

`npm i typescript-css-modules`

## Usage with `.css` files

```js
{
  test: /\.css$/,
  loaders: [
    { loader: "style-loader" },
    { loader: "typescript-css-modules-loader" },
  ],
}
```

## Usage with preprocessors (Sass, Stylus, Less, etc)

If you're using a preprocessor, put `"typescript-css-modules-loader"` just before your preprocessor loader.

```js
{
  test: /\.styl$/,
  loaders: [
    { loader: "style-loader" },
    { loader: "typescript-css-modules-loader" },
    { loader: "stylus-loader" },
  ],
}
```
