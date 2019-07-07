<template>
  <el-card class="border-card">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">{{$t('institution.relevantAssets')}}</span>
    </div>
    <div class="mt-20">
      <!--sds资产信息-->
      <div class="basic" v-if="sdsAsset">
        <span class="basic-title">SDS:</span>
        <span class="basic-content">
          <span :title="setDp(sdsAsset.balance)">{{sdsAsset.balance | decimalPlaces(2)}}</span>
          <span :title="setDp(sdsAsset.value)"
                class="basic-value">(${{sdsAsset.value | decimalPlaces(2)}})</span>
        </span>
      </div>
      <!--nep55资产信息-->
      <template v-if="nep55Assets">
        <div class="basic" v-for="(item,index) in nep55Assets" :key="index">
          <span class="basic-title">{{item.symbol}}:</span>
          <span class="basic-content">
          <span :title="setDp(item.balance)">{{item.balance | decimalPlaces(2)}}</span>
          <span :title="setDp(item.value)"
                class="basic-value">(${{item.value | decimalPlaces(2)}})</span>
        </span>
        </div>
      </template>
    </div>
  </el-card>
</template>

<script>
  import {decimalPlaces} from '~/filters/core'
  import {setDp} from '~/utils/core'
  import {find, filter} from 'lodash'
  import getSarAddr from '~/mixins/getSarAddr'

  export default {
    name: 'BasicInfo',
    props: {
      assets: {
        type: Array,
        required: true,
      }
    },
    computed: {
      //sds资产
      sdsAsset() {
        let sdsAsset = find(this.assets, o => o.assetid === this.sarAddr.sds.hash);
        return sdsAsset;
      },
      //nep55资产
      nep55Assets() {
        let nep55Assets = filter(this.assets, o => o.type === 'nep55');
        return nep55Assets;
      },
    },
    mixins:[getSarAddr],
    filters: {
      decimalPlaces
    },
    methods: {
      setDp,
    }
  }
</script>

<style lang="scss" scoped>
  .basic {
    margin-bottom: 20px;
    line-height: 20px;
    &-title {
      display: inline-block;
      width: 100px;
      font-weight: bold;
    }
    &-value {
      color: #9999AA;
      margin-left: 4px;
    }
  }
</style>
