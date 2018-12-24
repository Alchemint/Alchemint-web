<template>
  <el-card class="border-card">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">{{$t('individual.relevantAssets.title')}}</span>
    </div>
    <el-table class="no-border-table cell-first-highlight"
              stripe
              v-loading="loading"
              :element-loading-text="$t('global.loading')"
              element-loading-spinner="el-icon-loading"
              :data="assetsData"
              :height="240"
              style="width: 100%">
      <el-table-column prop="symbol"
                       :label="$t('individual.relevantAssets.type')"
                       width="120"></el-table-column>
      <el-table-column prop="showBalance"
                       :label="$t('individual.relevantAssets.quantity')"
                       align="right"
                       width="150">
        <template slot-scope="scope">
          {{scope.row.showBalance | numFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="showPrice"
                       :label="$t('individual.relevantAssets.price')"
                       align="right"
                       width="180">
        <template slot-scope="scope">
          ${{scope.row.showPrice | numFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="totalVal"
                       :label="$t('individual.relevantAssets.value')"
                       align="right"
                       min-width="160">
        <template slot-scope="scope">
          ${{scope.row.totalVal | numFormat}}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  import {orderBy, forEach} from 'lodash';
  import {numFormat} from "../../filters";

  export default {
    name: 'MyAsset',
    props: ['assets'],
    computed: {
      loading() {
        return this.assets ? false : true;
      },
      assetsData() {
        if (this.assets) {
          let result = [];
          let names = ['NEO', 'SNEO', 'SDUSD', 'SDS'];
          forEach(this.assets, item => {
            if (names.indexOf(item.symbol) > -1) {
              result.push(item);
            }
          });
          let tempArr = orderBy(result, ['total_val'], ['desc']);
          return tempArr;
        }
        return [];
      }
    },
    filters: {
      numFormat,
    }
  }
</script>

