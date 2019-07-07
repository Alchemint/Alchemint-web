<template>
  <div class="app">
    <el-alert v-if="blockHeightDiff"
              :title="$t('nav.maintenanceState')"
              class="maintenance-state" center>
    </el-alert>
    <nav-bar class="app-nav"></nav-bar>
    <div :class="['app-container',{
      'bg-background':currentEnv==='testNet',
      'has-block-height':blockHeightDiff,
    }]">
      <div class="app-container-content">
        <nuxt></nuxt>
      </div>
    </div>
    <contact-footer></contact-footer>
  </div>
</template>

<script>
  import navBar from '../components/layout/navBar'
  import contactFooter from '../components/layout/contactFooter'
  import {envs} from '../utils/const'
  import {find} from 'lodash'
  import {getBlockCount, getNgdBlockCount} from '../api/global'
  import axios from 'axios'

  export default {
    components: {
      navBar,
      contactFooter,
    },
    data() {
      return {
        currentEnv: '',
        opSarService: false,
        timer: null,
        blockHeightDiff: false,
      }
    },
    async created() {
      let env = process.env._ENV;
      let currentObj = find(envs, o => o.name === env);
      this.currentEnv = currentObj.name;

      if (env === 'neo') {
        this.judgeHeightDiff();
        this.timer = setInterval(() => {
          this.judgeHeightDiff();
        }, 1000 * 60 * 2)
      }
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    methods: {
      judgeHeightDiff() {
        this.getBlockHeight().then(myBlockHeight => {
          this.getOtherBlockHeight().then(otherBlockHeight => {
            if (myBlockHeight && otherBlockHeight) {
              let result = otherBlockHeight - myBlockHeight;
              this.blockHeightDiff = result > 10 ? true : false;
            } else {
              this.blockHeightDiff = false;
            }
          })
        }).catch(err => {
          console.log(err);
        })
      },
      async getBlockHeight() {
        let res = await getBlockCount([]);
        if (res.result) {
          return Number(res.result[0].blockcount);
        }
      },
      async getOtherBlockHeight() {
        let res = await getNgdBlockCount([]);
        if (res.result) {
          return Number(res.result[0].blockcount);
        }
        /*let tempObj = await
          axios.post('https://seed1.switcheo.network:10331', {
            "jsonrpc": "2.0",
            "method": 'getblockcount',
            "id": "1",
            "params": [],
          });
        if (!tempObj.data) {
          return;
        }
        return Number(tempObj.data.result);*/
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/styles/var";

  .app-container {
    width: 100%;
    min-width: 1280px;
    min-height: calc(100% - 70px - 136px);
    &.has-block-height {
      min-height: calc(100% - 70px - 136px - 40px);
    }
    &.bg-background {
      background: url('../assets/img/background.png') repeat;
    }
    &-content {
      width: 1280px;
      margin: 0 auto;
      padding: 0 40px 60px;
    }
  }
</style>

<style lang="scss">
  @import "../assets/styles/var";

  .maintenance-state {
    width: 100%;
    min-width: 1280px;
    height: 40px;
    background: $--color-primary;
    border-radius: 0;
    .el-alert__title {
      color: #fff;
      font-size: 14px;
      font-weight: 500;
    }
    .el-alert__closebtn {
      font-size: 14px;
      color: #fff;
    }
  }
</style>

