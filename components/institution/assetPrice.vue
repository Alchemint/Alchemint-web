<template>
  <el-card class="border-card">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">{{$t('institution.assetPrice')}}</span>
    </div>
    <el-table class="no-border-table cell-first-highlight"
              stripe
              :data="anchorPrices"
              height="290"
              style="width: 100%">
      <el-table-column :prop="$i18n.locale==='en'?'name':'zhName'"
                       :label="$t('institution.name')"
                       width="100"></el-table-column>
      <el-table-column prop="price"
                       :label="$t('institution.lastestPrice')"
                       align="right"
                       width="140">
        <template slot-scope="scope">
          <span :title="setDp(scope.row.price)">
            ${{scope.row.price | decimalPlaces(4)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="right"
                       min-width="10">
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  import {decimalPlaces} from '~/filters/core'
  import {setDp} from '../../utils/core'
  import {forEach, find} from 'lodash'
  import {mapGetters} from 'vuex'

  export default {
    name: 'AssetPrice',
    data() {
      return {
        anchorPrices: [  //锚定物资产价格列表
          {
            name: 'SDS',
            zhName: 'SDS',
            anchor: 'sds_price',
            price: 0,
          },
          {
            name: 'EUR',
            zhName: '欧元',
            anchor: 'anchor_type_eur',
            price: 0,
          },
          {
            name: 'YEN',
            zhName: '日元',
            anchor: 'anchor_type_jpy',
            price: 0,
          },
          {
            name: 'GBP',
            zhName: '英镑',
            anchor: 'anchor_type_gbp',
            price: 0,
          },
          {
            name: 'GOLD',
            zhName: '黄金',
            anchor: 'anchor_type_gold',
            price: 0,
          },
        ], //资产价格列表
      }
    },
    computed: {
      ...mapGetters(['typeB'])
    },
    filters: {
      decimalPlaces
    },
    mounted() {
      this.setAnchorPrice();
    },
    methods: {
      setDp,
      //B端资产价格
      async setAnchorPrice() {
        await this.$store.dispatch('getTypeB');
        forEach(this.anchorPrices, item => {
          let configObj = find(this.typeB, o => o.key === item.anchor);
          item.price = configObj ? configObj.value : 0;
        });
      },
    }
  }
</script>
