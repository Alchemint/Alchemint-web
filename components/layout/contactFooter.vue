<template>
  <div class="footer clearfix">
    <a class="footer-item"
       :href="$i18n.locale==='zh'?'/pdf/操作手册.pdf':'/pdf/User-Manual.pdf'"
       target="_blank">
      <img class="footer-item__icon" src="~/assets/img/manual.svg" alt="user manual">
      <span class="footer-item__content">{{$t('nav.userManual')}}</span>
    </a>
    <a class="footer-item"
       href="https://v.qq.com/x/page/o0815gmnowt.html"
       target="_blank">
      <img class="footer-item__icon" src="~/assets/img/video.svg" alt="video tutorial">
      <span class="footer-item__content">{{$t('nav.video')}}</span>
    </a>
    <a class="footer-item"
       :href="$i18n.locale==='zh'?'https://t.me/AlchemintCN':'https://t.me/alchemint'"
       target="_blank">
      <img class="footer-item__icon" src="~/assets/img/contact.svg" alt="contact us">
      <span class="footer-item__content">{{$t('nav.contact')}}</span>
    </a>
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
    width: 1200px;
    margin: 0 auto 30px;
    &-item {
      float: left;
      width: 380px;
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
</style>
