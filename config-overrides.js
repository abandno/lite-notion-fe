const { override, addWebpackAlias, babelInclude, addBabelPreset } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src')
  }),
  // // 额外包含一些需要预编译的目录
  // babelInclude([
  //   path.resolve('src'), // 确保你的src目录被包含
  //   path.resolve('node_modules/@nosferatu500/theme-file-explorer') // 添加你需要的node_modules目录
  // ]),
  addBabelPreset("@babel/preset-react")
);
