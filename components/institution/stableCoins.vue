<template>
  <el-card class="border-card">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">{{$t('institution.stableCoinsMarket')}}</span>
    </div>
    <el-table class="no-border-table cell-first-highlight"
              stripe
              :data="stableCoinList"
              height="290"
              v-loading="loading"
              :element-loading-text="$t('global.loading')"
              element-loading-spinner="el-icon-loading"
              style="width: 100%">
      <el-table-column prop="name"
                       :label="$t('institution.currency')"
                       width="100"></el-table-column>
      <el-table-column prop="anchorType"
                       :label="$t('institution.peg')"
                       align="right"
                       width="80">
        <template slot-scope="scope">
          <span>{{scope.row.anchor | filterMethod($t('anchorTypes'))}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sarHasDrawed"
                       :label="$t('institution.circulation')"
                       align="right"
                       min-width="160">
        <template slot-scope="scope">
          <span :title="setDp(scope.row.hasDrawed)">
            {{scope.row.hasDrawed | decimalPlaces(2)}}</span>
          <span :title="setDp(scope.row.nep55Value)" class="coin-val">
            (${{scope.row.nep55Value | decimalPlaces(2)}})</span>
        </template>
      </el-table-column>
      <el-table-column prop="sarLocked"
                       :label="$t('institution.margin')"
                       align="right"
                       min-width="160">
        <template slot-scope="scope">
          <span :title="setDp(scope.row.locked)">
            {{scope.row.locked | decimalPlaces(2)}}</span>
          <span :title="setDp(scope.row.sdsValue)" class="coin-val">
            (${{scope.row.sdsValue | decimalPlaces(2)}})</span>
        </template>
      </el-table-column>
      <el-table-column prop="mortgageRate"
                       :label="$t('institution.marginRate')"
                       align="right"
                       min-width="140">
        <template slot-scope="scope">
          {{scope.row.mortgageRate | decimalPlaces(2)}}%
        </template>
      </el-table-column>
      <el-table-column align="right" width="20"></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  import {getsar4BDetailList} from '~/api/institution'
  import {filterMethod, decimalPlaces} from '~/filters/core'
  import {setDp} from '~/utils/core'
  import getSarAddr from '~/mixins/getSarAddr'

  export default {
    name: 'StableCoin',
    data() {
      return {
        stableCoinList: null, //稳定币列表数据,
        loading: true, //加载数据,
      }
    },
    filters: {
      filterMethod,
      decimalPlaces
    },
    mixins: [getSarAddr],
    mounted() {
      this.getStableCoinList();
    },
    methods: {
      setDp,
      //B端稳定币列表
      async getStableCoinList() {
        //设置loading为true
        this.loading = true;

        //获取数据
        let scAddr = this.sarAddr.sarB.hash;
        let params = [1, scAddr, 1000, 1];
        let _stableCoinList = await getsar4BDetailList(params);
        let stableCoinList = _stableCoinList.result;
        if (!stableCoinList) {
          this.stableCoinList = [];
          this.loading = false; //关闭loading
          return false;
        }
        this.stableCoinList = stableCoinList;
        this.loading = false; //关闭loading
      },
    }
  }
</script>

<style lang="scss" scoped>
  .coin-val {
    color: #9999AA;
    margin-left: 4px;
  }
</style>
