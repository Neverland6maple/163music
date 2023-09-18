const { defineConfig } = require('@vue/cli-service');
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:'./',
  outputDir:'dist',
  devServer:{
    // proxy:{
    //   '/api':{
    //     target:'http://localhost:3000',
    //     changeOrigin:true,
    //     pathRewrite: {
    //       '^/api': ''//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
    //     }
    //   }
    // }
  },
  productionSourceMap:false,
  chainWebpack: config => {
    //webpack-bundle-analyzer
    config
    .plugin('webpack-bundle-analyzer')
    .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          exclude: /node_modules/,
          type: 'javascript/auto',
          use: [
            {
              loader: 'url-loader',
              options: {
                esModule: false,
                name: 'img/[name].[hash:3].[ext]',
                limit: 1024 * 10,
                context: path.resolve(__dirname, './src'), 
                publicPath: './'
              }
            }
          ]
        },
      ]
    },
    optimization: {
      runtimeChunk: true,
      splitChunks: {
        chunks: "initial", 
        automaticNameDelimiter: '~',  
        cacheGroups: { // 缓存组
          vendors: {
            test: /[\\/]node_modules[\\/]/,
          },
        },
      }
    },
    plugins:[

    ],
    externals:{
      // 'vue': 'Vue',
      // 'vue-router': 'VueRouter',
    },
  },
})
