<template>
  <el-card class="border-card">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">{{$t('institution.assetPrice')}}</span>
    </div>
    <el-table class="no-border-table cell-first-highlight"
              stripe
              :data="data"
              height="290"
              style="width: 100%">
      <el-table-column :prop="$i18n.locale==='en'?'name':'zhName'"
                       :label="$t('institution.name')"
                       width="100"></el-table-column>
      <el-table-column prop="rate"
                       :label="$t('institution.lastestPrice')"
                       align="right"
                       width="140">
        <template slot-scope="scope">
          ${{scope.row.rate | numFormat}}
        </template>
      </el-table-column>
      <el-table-column align="right"
                       min-width="10">
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  import {formatPrecision, bigmath, printNumber} from '../../utils'
  import {forEach} from 'lodash'
  import {numFormat} from '../../filters'

  export default {
    name: 'AssetPrice',
    props: {
      sarConfig: {
        type: Object,
        required: true,
      }
    },
    filters: {
      numFormat,
    },
    data() {
      return {
        data: [
          {
            name: 'SDS',
            zhName: 'SDS',
            rate: '',
            price: 'sds_price',
          },
          {
            name: 'EUR',
            zhName: '欧元',
            rate: '',
            price: 'anchor_type_eur',
          },
          {
            name: 'YEN',
            zhName: '日元',
            rate: '',
            price: 'anchor_type_jpy',
          },
          {
            name: 'GBP',
            zhName: '英镑',
            rate: '',
            price: 'anchor_type_gbp',
          },
          {
            name: 'GOLD',
            zhName: '黄金',
            rate: '',
            price: 'anchor_type_gold',
          },
        ]
      }
    },
    mounted() {
      forEach(this.data, item => {
        item.rate = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(this.sarConfig[item.price]))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 4
        )
      });
    },
    methods: {}
  }
</script>
