<template>
  <el-tabs :class="['wallet',{'wallet-assets-active':activeTab==='assets'}]"
           v-model="activeTab"
           @tab-click="handleTabClick">
    <el-tab-pane :label="$t('wallet.asset')" name="assets">
      <span slot="label">
        <img class="tab-icon" src="~/assets/img/assets.png" :alt="$t('wallet.asset')">
        {{$t('wallet.asset')}}
      </span>
      <assets v-if="currentUser && activeTab==='assets'"
              :assets="assets"
              :current-user="currentUser"></assets>
    </el-tab-pane>
    <el-tab-pane :label="$t('wallet.transfer')" name="transfer">
      <span slot="label">
        <img class="tab-icon" src="~/assets/img/transfer.png" :alt="$t('wallet.transfer')">
        {{$t('wallet.transfer')}}
      </span>
      <transfer v-if="assets && activeTab==='transfer'"
                :assets="assets"
                :current-user="currentUser"></transfer>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import assets from '~/components/wallet/assets.vue'
  import transfer from '~/components/wallet/transfer.vue'
  import {mapGetters} from 'vuex'
  import getAssets from '~/mixins/getAssets'
  import {invokeScript} from '../../../api/global'

  export default {
    name: 'Wallet',
    data() {
      return {
        assets: null,
      }
    },
    computed: {
      ...mapGetters([
        'currentUser'
      ]),
      activeTab: {
        get() {
          return this.$route.query.tab || 'assets';
        },
        set() {
        }
      }
    },
    components: {
      assets,
      transfer
    },
    mixins: [getAssets],
    async mounted() {
      if (!this.currentUser) {
        this.$router.push({path: `${this.$i18n.locale === 'en' ? '' : '/zh'}/login`});
      }
      await this.initAssets(true);

      const {tab} = this.$route.query;
      if (!tab) {
        this.changeRouteQuery({tab: 'assets'}, false);
      }
      //this.getBalance();
    },
    methods: {
      handleTabClick(tab) {
        this.changeRouteQuery({tab: tab.name}, true);
      },
      changeRouteQuery({tab}, onlyTab) {
        const queryObj = JSON.parse(JSON.stringify({tab}));
        this.$router.push({
          path: this.$route.path,
          query: onlyTab ? {...queryObj} : {...this.$route.query, ...queryObj},
        });
      },
      /*async getBalance() {
        let scAddr = this.sarAddr.sdusd.hash;
        let params = [
          {
            param: ['(addr)' + this.currentUser.address],
            method: 'balanceOf',
          }
        ];
        let scHash = eNeo.emitParams(scAddr, params);
        let _r = await invokeScript([scHash]);
        console.log(eNeo.hex2Integer(_r.result[0].stack[0].value));
      }*/
    }
  }
</script>

<style lang="scss" scoped>
  .wallet {
    padding-top: 30px;
    > div {
      margin-top: 30px;
      &:first-child {
        margin-top: 0;
      }
    }
    .tab-icon {
      margin-right: 6px;
      display: inline-block;
      vertical-align: middle;
    }
  }
</style>

<style lang="scss">
  .wallet {
    &.wallet-assets-active {
      .el-tabs__active-bar {
        background-color: #FEB178;
      }
    }
    .el-tabs__header {
      background: #fff;
      border-radius: 2px;
      height: 60px;
      line-height: 60px;
      width: 100%;
      padding: 0 15px;
      margin: 0;
      border: 1px solid #E6EAEE;
      .el-tabs__item {
        font-size: 18px;
        &.is-active, &:hover, &:focus {
          color: #303133;
        }
      }
    }
    .el-tabs__active-bar {
      background-color: #97EAB1;
    }
    .el-tabs__nav-wrap::after {
      display: none !important;
    }
  }
</style>
