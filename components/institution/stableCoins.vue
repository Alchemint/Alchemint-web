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
          <span>{{scope.row.anchorType | filterMethod($t('anchorTypes'))}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sarHasDrawed"
                       :label="$t('institution.circulation')"
                       align="right"
                       min-width="160">
        <template slot-scope="scope">
          <span>{{scope.row.sarHasDrawedShow | numFormat}}</span>
          <span class="coin-val">(${{scope.row.sarHasDrawedTranUsd | numFormat}})</span>
        </template>
      </el-table-column>
      <el-table-column prop="sarLocked"
                       :label="$t('institution.margin')"
                       align="right"
                       min-width="160">
        <template slot-scope="scope">
          <span>{{scope.row.sarLockedShow | numFormat}}</span>
          <span class="coin-val">(${{scope.row.sarLockedTranUsd | numFormat}})</span>
        </template>
      </el-table-column>
      <el-table-column prop="ratioAvailShow"
                       :label="$t('institution.marginRate')"
                       align="right"
                       min-width="140">
        <template slot-scope="scope">
          {{scope.row.ratioAvailShow | numFormat}}
        </template>
      </el-table-column>
      <el-table-column align="right" width="20"></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  import {getSarBType} from '../../api/institution'
  import {filterMethod, numFormat} from '../../filters'
  import getSarAddr from '../../mixins/getSarAddr'

  export default {
    name: 'StableCoin',
    data() {
      return {
        stableCoinList: null,
        loading: true,
      }
    },
    mixins: [getSarAddr],
    mounted() {
      this.getStableCoinList();
    },
    filters: {
      filterMethod,
      numFormat
    },
    methods: {
      async getStableCoinList() {
        let scAddr = this.sarAddr.sarB.hash;
        let params = [1, scAddr, 10000, 1];
        let _stableCoinList = await getSarBType(params);
        let stableCoinList = _stableCoinList.result;
        let tempArr = [];
        if (stableCoinList) {
          for (let i = 0, len = stableCoinList.length; i < len; i++) {
            let item = stableCoinList[i];
            let data = await this.$parent.getSarInfo(item.addr);
            if (data) {
              tempArr.push(data);
            }
          }
          this.loading = false;
        } else {
          this.loading = false;
        }

        this.stableCoinList = tempArr;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .coin-val {
    color: #9999AA;
    margin-left: 4px;
  }
</style>
