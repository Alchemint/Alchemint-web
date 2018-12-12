<template>
  <div class="footer">
    <a href="https://twitter.com/Alchemint_io" target="_blank">Twitter</a>
    <span>|</span>
    <a href="https://t.me/alchemint" target="_blank">Telegram</a>
    <span>|</span>
    <a href="#"
       v-clipboard:copy="'service@alchemint.io'"
       v-clipboard:success="onCopy"
       v-clipboard:error="onError">E-mail</a>
    <span>|</span>
    <a href="https://alchemint.io" target="_blank">Alchemint.io</a>
    <span>|</span>
    <a v-if="$i18n.locale==='zh'" href="/pdf/操作手册.pdf" target="_blank">{{$t('nav.userManual')}}</a>
    <a v-if="$i18n.locale==='en'" href="/pdf/User-Manual.pdf" target="_blank">{{$t('nav.userManual')}}</a>
    <span>|</span>
    <a v-if="$i18n.locale==='zh'" href="/pdf/操作手册.pdf" target="_blank">{{$t('nav.termsService')}}</a>
    <a v-if="$i18n.locale==='en'" href="/pdf/User-Manual.pdf" target="_blank">{{$t('nav.termsService')}}</a>
  </div>
</template>

<script>
  import clipBoard from '../../mixins/clipboard'

  export default {
    name: 'Footer',
    mixins: [clipBoard],
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/var";

  .footer {
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    text-align: center;
    background: $--nav-bg;
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
</style>
