module.exports = {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: 'alchemint',
    meta: [{
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
        content: 'Nuxt.js project'
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
      },
      {
        src: '/neoLib/eNeo.js'
      }
    ]
  },
  env: {
    _ENV: process.env._ENV || 'pri',
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
    extend(config, {
      isDev,
      isClient
    }) {
      if (isDev && isClient) {
        config.entry['polyfill'] = ['babel-polyfill'];
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)|static/
        })
      }
    },
    vendor: ['axios'],
    babel: {}
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
      '/zh',
      '/zh/login',
      '/zh/register',
      '/zh/individual',
      '/zh/institution',
      '/zh/wallet',
      '/zh/tools',
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
    '~/plugins/high-charts.js',
    {src: '~/plugins/ga', ssr: false}
  ]
};
