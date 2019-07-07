<template>
  <div class="footer">
    <div class="footer-top clearfix">
      <a class="footer-top-item"
         :href="$i18n.locale==='zh'?'/pdf/操作手册.pdf':'/pdf/User-Manual.pdf'"
         target="_blank">
        <img class="footer-top-item__icon" src="~/assets/img/manual.svg" alt="user manual">
        <span class="footer-top-item__content">{{$t('nav.userManual')}}</span>
      </a>
      <a class="footer-top-item"
         :href="$i18n.locale==='zh'?'https://v.qq.com/x/page/o0815gmnowt.html':'https://www.youtube.com/watch?v=3dkTkDJsAQg&list=PLxPwdLM05cDOZW9OlMIRAlmIYme2coN9f'"
         target="_blank">
        <img class="footer-top-item__icon" src="~/assets/img/video.svg" alt="video tutorial">
        <span class="footer-top-item__content">{{$t('nav.video')}}</span>
      </a>
      <a class="footer-top-item"
         :href="$i18n.locale==='zh'?'https://t.me/AlchemintCN':'https://t.me/alchemint'"
         target="_blank">
        <img class="footer-top-item__icon" src="~/assets/img/contact.svg" alt="contact us">
        <span class="footer-top-item__content">{{$t('nav.contact')}}</span>
      </a>
      <nuxt-link class="footer-top-item"
                 :to="$i18n.path('faq')">
        <img class="footer-top-item__icon" src="~/assets/img/contact.svg" alt="contact us">
        <span class="footer-top-item__content">FAQ</span>
      </nuxt-link>
    </div>
    <div class="footer-bottom">
      <a href="https://twitter.com/Alchemint_io" target="_blank">Twitter</a>
      <span>|</span>
      <a href="https://t.me/alchemint" target="_blank">Telegram</a>
      <span>|</span>
      <el-tooltip content="service@alchemint.io" placement="top" effect="light">
        <span class="pointer">E-mail</span>
      </el-tooltip>
      <span>|</span>
      <a href="https://alchemint.io" target="_blank">Alchemint.io</a>
      <span>|</span>
      <span class="pointer" @click="opSarService">{{$t('nav.termsService')}}</span>
    </div>

    <!--Terms of Service-->
    <sar-service v-if="currentEnv==='neo'"
                 :sar-service-display="sarServiceDisplay"></sar-service>
  </div>
</template>

<script>
  import {find} from 'lodash'
  import {envs} from '~/utils/const'
  import sarService from '~/components/layout/sarService'

  export default {
    name: 'Footer',
    data() {
      return {
        currentEnv: '',
        sarServiceDisplay: false,
      }
    },
    components: {
      sarService
    },
    created() {
      let env = process.env._ENV;
      let currentObj = find(envs, o => o.name === env);
      this.currentEnv = currentObj.name;
    },
    mounted() {
      let readSarService = localStorage.getItem('readSarService');
      this.sarServiceDisplay = Number(readSarService) === 1 ? false : true;
    },
    methods: {
      opSarService() {
        localStorage.removeItem('readSarService');
        this.sarServiceDisplay = true;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/var";

  .footer {
    .footer-top {
      width: 1200px;
      margin: 0 auto;

      &-item {
        float: left;
        width: 275px;
        text-align: center;
        height: 66px;
        line-height: 66px;
        background: #fff;
        margin-left: 30px;

        &:first-child {
          margin-left: 0;
        }

        &__icon {
          display: inline-block;
          vertical-align: middle;
        }

        &__content {
          display: inline-block;
          vertical-align: middle;
          margin-left: 10px;
        }
      }
    }

    .footer-bottom {
      width: 100%;
      min-width: 1280px;
      height: 40px;
      line-height: 40px;
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      text-align: center;
      background: $--nav-bg;
      margin-top: 30px;

      > span {
        margin: 0 10px;
      }

      > a {
        cursor: pointer;
        margin: 0 10px;
        font-weight: bold;

        &:hover, &:active {
          color: #FFF;
        }
      }
    }
  }

  .pointer {
    cursor: pointer;
  }
</style>
