<template>
  <div class="app">
    <nav-bar class="app-nav"></nav-bar>
    <div :class="['app-container',{
      'bg-background':currentEnv==='testNet'
    }]">
      <div class="app-container-content">
        <nuxt></nuxt>
      </div>
    </div>
    <contact-footer :class="{'test-footer':currentEnv==='testNet'}"></contact-footer>
  </div>
</template>

<script>
  import navBar from '../components/layout/navBar'
  import contactFooter from '../components/layout/contactFooter'
  import {envs} from '../utils/const'
  import {find} from 'lodash'

  export default {
    components: {
      navBar,
      contactFooter
    },
    data() {
      return {
        currentEnv: ''
      }
    },
    created() {
      let env = process.env._ENV;
      let currentObj = find(envs, o => o.name === env);
      this.currentEnv = currentObj.name;
    },
  }
</script>

<style lang="scss" scoped>
  @import "../assets/styles/var";

  .app-container {
    width: 100%;
    min-width: 1280px;
    min-height: calc(100% - 70px - 40px);
    &.bg-background {
      background: url('../assets/img/background.png') repeat;
    }
    &-content {
      width: 1280px;
      margin: 0 auto;
      padding: 0 40px 60px;
    }
  }

  .test-footer {
    background: #1E5473 !important;
  }
</style>

