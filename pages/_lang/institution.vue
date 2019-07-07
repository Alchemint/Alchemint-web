<template>
  <div class="institution">
    <basic-info v-if="currentUser && assets" :assets="assets"></basic-info>
    <div class="clearfix">
      <stable-coins ref="stableCoins"
                    class="fl"
                    style="width:860px;margin-right: 30px"></stable-coins>
      <asset-price ref='assetPrice'
                   class="fr"
                   style="width: 310px"></asset-price>
    </div>
    <sar-b v-if="typeB"
           :type-b="typeB"
           @update-data="updateData"
           :assets="assets"></sar-b>
  </div>
</template>

<script>
  import {assetPrice, basicInfo, sarB, stableCoins} from '~/components/institution'
  import {getCurrentUser} from '~/utils/login'
  import getAssets from "~/mixins/getAssets";

  export default {
    name: 'Institution',
    data() {
      return {
        currentUser: null, //用户信息,
      }
    },
    components: {
      basicInfo,
      assetPrice,
      sarB,
      stableCoins,
    },
    mixins: [getAssets],
    async mounted() {
      //用户信息
      let user = getCurrentUser(this);
      this.currentUser = user;
    },
    methods: {
      //页面数据更新
      updateData() {
        //更新assets
        this.getAssets(this.currentUser.address);

        //更新typeB资产价格
        this.$refs.assetPrice.setAnchorPrice();

        //更新stableCoins列表
        this.$refs.stableCoins.getStableCoinList();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .institution {
    padding-top: 30px;
    > div {
      margin-top: 30px;
      &:first-child {
        margin-top: 0;
      }
    }
  }
</style>

