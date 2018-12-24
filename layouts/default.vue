<template>
  <div class="app">
    <!--warn info-->
    <!--<el-alert title="系统当前处于维护状态，暂不建议使用。预计于新加坡时间 X月X日 15：00 前恢复正常。"
              type="success" center>
    </el-alert>-->
    <nav-bar class="app-nav"></nav-bar>
    <div :class="['app-container',{
      'bg-background':currentEnv==='testNet'
    }]">
      <div class="app-container-content">
        <nuxt></nuxt>
      </div>
    </div>
    <contact-footer></contact-footer>

    <!--Terms of Service-->
    <sar-service v-if="currentEnv==='neo' && opSarService"></sar-service>
  </div>
</template>

<script>
  import navBar from '../components/layout/navBar'
  import contactFooter from '../components/layout/contactFooter'
  import sarService from '../components/layout/sarService'
  import {envs} from '../utils/const'
  import {find} from 'lodash'

  export default {
    components: {
      navBar,
      contactFooter,
      sarService
    },
    data() {
      return {
        currentEnv: '',
        opSarService: false,
      }
    },
    created() {
      let env = process.env._ENV;
      let currentObj = find(envs, o => o.name === env);
      this.currentEnv = currentObj.name;
    },
    mounted() {
      this.opSarService = localStorage.getItem('readSarService') === 'true' ? false : true;
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/styles/var";

  .app-container {
    width: 100%;
    min-width: 1280px;
    min-height: calc(100% - 70px - 96px);
    &.bg-background {
      background: url('../assets/img/background.png') repeat;
    }
    &-content {
      width: 1280px;
      margin: 0 auto;
      padding: 0 40px 30px;
    }
  }
</style>

