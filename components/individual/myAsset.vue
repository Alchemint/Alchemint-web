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
      <el-table-column prop="balance"
                       :label="$t('individual.relevantAssets.quantity')"
                       align="right"
                       width="150">
        <template slot-scope="scope">
          <span :title="setDp(scope.row.balance)" v-if="currentUser">
            {{scope.row.balance | decimalPlaces(2)}}
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="showPrice"
                       :label="$t('individual.relevantAssets.price')"
                       align="right"
                       width="180">
        <template slot-scope="scope">
          <span :title="'$'+setDp(scope.row.price)">
            ${{scope.row.price | decimalPlaces(4)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="totalVal"
                       :label="$t('individual.relevantAssets.value')"
                       align="right"
                       min-width="160">
        <template slot-scope="scope">
          <span :title="'$'+setDp(scope.row.value)" v-if="currentUser">
          ${{scope.row.value | decimalPlaces(4)}}
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  import {forEach} from 'lodash';
  import {decimalPlaces} from "~/filters/core";
  import {setDp} from '../../utils/core'

  export default {
    name: 'MyAsset',
    props: ['assets', 'currentUser'],
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
          return result;
        }
        return [];
      }
    },
    filters: {
      decimalPlaces,
    },
    methods: {
      setDp,
    }
  }
</script>

