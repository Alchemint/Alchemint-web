const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Alchemint',
    meta: [
      {
        charset: 'utf-8'
      },
      {
        httpEquiv: 'X-UA-Compatible',
        content: 'IE=edge,chrome=1'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Alchemint is a decentralized stablecoin issuing platform based on NEO blockchain. '
      },
      {
        property: 'og:title', content: 'Alchemint',
      },
      {
        property: 'og:image', content: 'https://neo.alchemint.io/_nuxt/img/logo_higher.c161d46.png',
      },
      {
        property: 'og.description',
        content: 'Alchemint is a decentralized stablecoin issuing platform based on NEO blockchain. ',
      },
      {
        property: 'og.locale', content: 'en_US',
      },
      {
        property: 'og.url', content: 'https://neo.alchemint.io/o3',
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }],
    script: [
      {
        src: '/lib/axios/axios.min.js'
      },
      {
        src: '/neoLib/rollup/aes.js'
      },
      {
        src: '/neoLib/component/aes.js'
      },
      {
        src: '/neoLib/component/mode-ecb.js'
      },
      {
        src: '/neoLib/component/pad-nopadding.js'
      },
      {
        src: '/neoLib/scrypt.js'
      },
      {
        src: '/neoLib/neo-ts.js'
      }
    ]
  },
  env: {
    _ENV: process.env._ENV || 'testNet',
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#5B98FA'
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLint on save
     */
    extend(config, {isDev, isClient}) {
      //扩展webpack的配置
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)|static/
        });
      }
    },
    vendor: ['babel-polyfill', 'axios', 'bignumber.js', 'lodash', "@cityofzion/neon-core/lib/wallet/core", 'switcheo-js/build/main', "~/utils/eNeo"],
    analyze: false
  },
  /*
   ** Global CSS
   */
  css: [
    'normalize.css',
    '~/assets/styles/index.scss',
  ],

  router: {
    middleware: 'i18n'
  },

  generate: {
    routes: [
      '/',
      '/login',
      '/register',
      '/individual',
      '/institution',
      '/wallet',
      '/tools',
      '/lock',
      '/faq',
      '/zh',
      '/zh/login',
      '/zh/register',
      '/zh/individual',
      '/zh/institution',
      '/zh/wallet',
      '/zh/tools',
      '/zh/lock',
      '/zh/faq',
    ]
  },

  /*
   ** Add element-ui in our app, see plugins/element-ui.js file
   */
  plugins: [
    '~/plugins/element-ui',
    '~/plugins/icon-font',
    '~/plugins/vueClipBoard',
    '~/plugins/i18n.js',
    {src: '~/plugins/ga', ssr: false}
  ]
};
