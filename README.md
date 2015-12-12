# A vue based reader for Zhihu daily

Built with [Vue.js](http://vuejs.org), [vue-router](https://github.com/vuejs/vue-router) and the inofficial [Zhihu Daily API](https://github.com/izzyleung/ZhihuDailyPurify/wiki/%E7%9F%A5%E4%B9%8E%E6%97%A5%E6%8A%A5-API-%E5%88%86%E6%9E%90), with routing, comments, comment folding, user profile & realtime updates.

The build setup uses [Webpack](http://webpack.github.io/) and the [vue-loader](https://github.com/vuejs/vue-loader) plugin, which enables Vue components to be written in a format that encapsulates a component's style, template and logic in a single file.

If you are using SublimeText you can get proper syntax highlighting for `*.vue` files with [vue-syntax-highlight](https://github.com/vuejs/vue-syntax-highlight).

### Building

``` bash
npm install
# watch:
npm run dev
# build:
npm run build
```

node proxy.js 开启代理服务器