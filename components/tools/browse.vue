<template>
  <div>
    <!--查询-->
    <el-card class="border-card mt-30">
      <div slot="header" class="border-card-header">
        <span class="border-card-header__title">{{$t('tools.browse.search')}}</span>
      </div>
      <div class="search-container">
        <el-input :placeholder="$t('tools.browse.searchPhl')"
                  class="search"
                  v-model="search"></el-input>
        <el-button type="primary" class="search-btn" @click="searchInput">{{$t('tools.browse.search')}}</el-button>
      </div>
    </el-card>

    <!--资产信息-->
    <el-card class="border-card mt-30" v-if="searchWay==='ADDR'">
      <div slot="header" class="border-card-header">
        <span class="border-card-header__title">{{$t('tools.browse.assetInfo')}}</span>
      </div>
      <el-table class="no-border-table cell-first-highlight"
                stripe
                :data="assets"
                v-loading="loading"
                :element-loading-text="$t('global.loading')"
                element-loading-spinner="el-icon-loading"
                :empty-text="$i18n.locale==='zh'?'无数据':'No Data'"
                style="width: 100%">
        <el-table-column prop="symbol"
                         :label="$t('wallet.currency')"
                         width="200"></el-table-column>
        <el-table-column prop="showBalance"
                         :label="$t('wallet.balance')"
                         align="right"
                         width="200">
          <template slot-scope="scope">
            <span :title="setDp(scope.row.balance)">
              {{scope.row.balance | decimalPlaces(2)}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="showPrice"
                         :label="$t('wallet.unitPrice')"
                         align="right"
                         width="300">
          <template slot-scope="scope">
            <span :title="'$'+setDp(scope.row.price)">
              ${{scope.row.price | decimalPlaces(4)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalVal"
                         :label="$t('wallet.totalValue')"
                         align="right"
                         min-width="150">
          <template slot-scope="scope">
            <span :title="'$'+setDp(scope.row.value)">
               ${{scope.row.value | decimalPlaces(4)}}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--交易信息-->
    <template v-if="searchWay==='TXID'">
      <!--基本信息-->
      <el-card class="border-card mt-30">
        <div slot="header" class="border-card-header">
          <span class="border-card-header__title">{{$t('tools.browse.transactionInfo')}}</span>
        </div>
        <div class="deal-info" v-if="dealInfo">
          <div class="deal-info-item">
            <div class="deal-info-item__title">{{$t('tools.browse.txid')}}</div>
            <div class="deal-info-item__content">{{dealInfo.txid.slice(2)}}</div>
          </div>
          <div class="deal-info-item">
            <div class="deal-info-item__title">{{$t('tools.browse.type')}}</div>
            <div class="deal-info-item__content">{{dealInfo.type}}</div>
          </div>
          <div class="deal-info-item">
            <div class="deal-info-item__title">{{$t('tools.browse.netFee')}}</div>
            <div class="deal-info-item__content">{{dealInfo.net_fee}} GAS</div>
          </div>
          <div class="deal-info-item">
            <div class="deal-info-item__title">{{$t('tools.browse.sysFee')}}</div>
            <div class="deal-info-item__content">{{dealInfo.sys_fee}} GAS</div>
          </div>
          <div class="deal-info-item">
            <div class="deal-info-item__title">{{$t('tools.browse.size')}}</div>
            <div class="deal-info-item__content">{{dealInfo.size}} bytes</div>
          </div>
          <div class="deal-info-item">
            <div class="deal-info-item__title">{{$t('tools.browse.height')}}</div>
            <div class="deal-info-item__content">{{dealInfo.blockindex}}</div>
          </div>
          <div class="deal-info-item">
            <div class="deal-info-item__title">{{$t('tools.browse.time')}}</div>
            <div class="deal-info-item__content">{{dealInfo.computedTime | filterTime}}</div>
          </div>
        </div>
      </el-card>
      <div class="clearfix">
        <!--输入-->
        <el-card class="border-card mt-30 fl" style="width: 585px">
          <div slot="header" class="border-card-header">
            <span class="border-card-header__title">{{$t('tools.browse.input')}}</span>
          </div>
          <el-table class="no-border-table cell-first-highlight"
                    stripe
                    v-if="dealInfo"
                    :data="dealInfo.vin"
                    :empty-text="$i18n.locale==='zh'?'无数据':'No Data'"
                    style="width: 100%">
            <el-table-column prop="address"
                             :label="$t('tools.browse.address')"
                             min-width="200"></el-table-column>
            <el-table-column prop="value"
                             :label="$t('tools.browse.asset')"
                             align="right"
                             width="100"></el-table-column>
          </el-table>
        </el-card>
        <!--输出-->
        <el-card class="border-card mt-30 fr" style="width: 585px">
          <div slot="header" class="border-card-header">
            <span class="border-card-header__title">{{$t('tools.browse.output')}}</span>
          </div>
          <el-table class="no-border-table cell-first-highlight"
                    stripe
                    v-if="dealInfo"
                    :data="dealInfo.vout"
                    :empty-text="$i18n.locale==='zh'?'无数据':'No Data'"
                    style="width: 100%">
            <el-table-column prop="address"
                             :label="$t('tools.browse.address')"
                             min-width="200"></el-table-column>
            <el-table-column prop="value"
                             :label="$t('tools.browse.asset')"
                             align="right"
                             width="100"></el-table-column>
          </el-table>
        </el-card>
      </div>
      <!--nep5-->
      <el-card class="border-card mt-30">
        <div slot="header" class="border-card-header">
          <span class="border-card-header__title">Nep5</span>
        </div>
        <el-table class="no-border-table cell-first-highlight"
                  stripe
                  :data="dealInfo.nep5"
                  v-if="dealInfo"
                  :empty-text="$i18n.locale==='zh'?'无数据':'No Data'"
                  style="width: 100%">
          <el-table-column prop="name"
                           :label="$t('tools.browse.asset')"
                           width="120">
          </el-table-column>
          <el-table-column prop="from"
                           :label="$t('tools.browse.from')"
                           min-width="120"></el-table-column>
          <el-table-column prop="to"
                           :label="$t('tools.browse.to')"
                           min-width="120"></el-table-column>
          <el-table-column prop="value"
                           :label="$t('tools.browse.value')"
                           width="120"></el-table-column>
        </el-table>
      </el-card>
    </template>
  </div>
</template>

<script>
  import {getAllassetBalance, getTxDetail} from '~/api/global'
  import {decimalPlaces, filterTime} from '~/filters/core'
  import {setDp} from '~/utils/core'
  import handleEnter from '../../mixins/handleEnter'

  export default {
    name: 'Browse',
    data() {
      return {
        search: '',
        searchWay: '',//ADDR or TXID
        assets: null,
        loading: false,
        dealInfo: null, //交易
      }
    },
    filters: {
      filterTime,
      decimalPlaces
    },
    mixins: [handleEnter],
    methods: {
      setDp,
      verifyAddr(addr) {
        let reg = /^[a-zA-Z0-9]{34,34}$/;
        if (!reg.test(addr)) {
          return false;
        } else {
          return true;
        }
      },
      verifyTxid(txid) {
        let reg = /^[a-f0-9]{64,64}$/;
        if (!reg.test(txid)) {
          return false;
        } else {
          return true;
        }
      },
      searchInput() {
        if (this.verifyAddr(this.search)) {
          this.searchWay = 'ADDR';
          this.getAssets();
        } else if (this.verifyTxid(this.search)) {
          this.searchWay = 'TXID';
          this.getTxid();
        }
      },
      getAssets() {
        this.loading = true;
        getAllassetBalance([this.search]).then(res => {
          this.loading = false;
          if (res.result) {
            this.assets = res.result;
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      getTxid() {
        getTxDetail([this.search]).then(res => {
          if (res.result) {
            let data = res.result[0];
            //时间从秒转换为毫秒
            data.computedTime = data.time * 1000;
            this.dealInfo = data;
          }
        }).catch(() => {
        })
      },
      handleEnter() {
        this.searchInput();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-container {
    .search {
      width: 700px;
    }
    .search-btn {
      margin-left: 16px;
      width: 120px;
    }
  }

  .deal-info {
    &-item {
      line-height: 50px;
      &__title {
        float: left;
        width: 140px;
      }
    }
  }

  .input-info {

  }
</style>
