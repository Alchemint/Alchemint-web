<template>
  <el-tabs :class="['wallet',{
           'wallet-assets-yellow':activeTab==='assets',
           'wallet-assets-green':activeTab==='transfer',
           'wallet-assets-blue':activeTab==='lock',
           }]"
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
                :current-user="currentUser"
                @update-assets="updateAssets"></transfer>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import assets from "~/components/wallet/assets.vue";
  import transfer from "~/components/wallet/transfer.vue";
  import {getCurrentUser} from "~/utils/login";
  import getAssets from "~/mixins/getAssets";

  export default {
    name: "Wallet",
    data() {
      return {
        assets: null,
        currentUser: null
      };
    },
    computed: {
      activeTab: {
        get() {
          return this.$route.query.tab || "assets";
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
      //获取用户信息
      let user = getCurrentUser(this);
      this.currentUser = user;

      //未登录跳转到登录界面
      if (!user) {
        this.$router.replace({
          path: `${this.$i18n.locale === "en" ? "" : "/zh"}/login`
        });
        return false;
      }

      //tab跳转
      const {tab} = this.$route.query;
      if (!tab) {
        this.changeRouteQuery({tab: "assets"}, false);
      }
    },
    methods: {
      handleTabClick(tab) {
        this.changeRouteQuery({tab: tab.name}, true);
      },
      changeRouteQuery({tab}, onlyTab) {
        const queryObj = JSON.parse(JSON.stringify({tab}));
        this.$router.push({
          path: this.$route.path,
          query: onlyTab ? {...queryObj} : {...this.$route.query, ...queryObj}
        });
      },

      //更新数据
      updateAssets() {
        //更新assets,
        this.getAssets(this.currentUser.address);
      }
    }
  };
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
  @import "../../assets/styles/var";

  .wallet {
    &.wallet-assets-yellow {
      .el-tabs__active-bar {
        background-color: #feb178;
      }
    }

    &.wallet-assets-green {
      .el-tabs__active-bar {
        background-color: #97eab1;
      }
    }

    &.wallet-assets-blue {
      .el-tabs__active-bar {
        background-color: $--color-primary;
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
      border: 1px solid #e6eaee;

      .el-tabs__item {
        font-size: 18px;

        &.is-active,
        &:hover,
        &:focus {
          color: #303133;
        }
      }
    }

    .el-tabs__active-bar {
      background-color: #97eab1;
    }

    .el-tabs__nav-wrap::after {
      display: none !important;
    }
  }
</style>
