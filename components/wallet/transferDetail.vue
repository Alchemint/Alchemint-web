<template>
  <el-card class="border-card mt-30 transfer-history content-no-padding">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">{{$t('wallet.transferHistory')}}</span>
    </div>
    <!--transfer category-->
    <div class="transfer-history-search">
      <el-button :type="search==='sdusd'?'primary':'default'"
                 :disabled="loading"
                 @click.native="search='sdusd'">SDUSD
      </el-button>
      <el-button :type="search==='nep5'?'primary':'default'"
                 :disabled="loading"
                 @click.native="search='nep5'">NEP-5
      </el-button>
      <el-button :type="search==='nep55'?'primary':'default'"
                 :disabled="loading"
                 @click.native="search='nep55'">{{$t('wallet.category.sarB')}}
      </el-button>
      <el-button :type="search==='global'?'primary':'default'"
                 :disabled="loading"
                 @click.native="search='global'">{{$t('wallet.category.global')}}
      </el-button>
    </div>

    <!--transfer list-->
    <div v-loading="loading"
         :element-loading-text="$t('global.loading')"
         element-loading-spinner="el-icon-loading">
      <div v-if="historyList" class="transfer-history-data">
        <!--not global transfer-->
        <div v-if="search!=='global'"
             class="transfer-history-item"
             v-for="item in historyList"
             :key="item.id">
          <div class="time">{{item.date}}</div>
          <div class="detail">
            <template v-if="item.isFrom">
              <span class="from"><b style="margin-right: 20px">- {{item.value | numFormat}}</b>{{item.name}}</span>
              <span><i class="el-icon-upload2" style="margin-right: 6px"></i>
                  {{$t('wallet.to')}}：
                <span v-if="search==='sdusd' || search==='nep5'">{{item.to?item.to:$t('wallet.cSystemInfo')}}</span>
                <span v-if="search==='nep55'">{{item.to?item.to:$t('wallet.bSystemInfo')}}</span>
              </span>
              <el-button v-if="item.to"
                         class="small-btn"
                         type="primary"
                         plain
                         v-clipboard:copy="item.to"
                         v-clipboard:success="onCopy"
                         v-clipboard:error="onError">{{$t('global.copy')}}
              </el-button>
            </template>
            <template v-else>
              <span class="to"><b style="margin-right: 20px">+ {{item.value | numFormat}}</b>{{item.name}}</span>
              <span><i class="el-icon-download" style="margin-right: 6px"></i>
                  {{$t('wallet.from')}}：
                <span v-if="search==='sdusd' || search==='nep5'">{{item.from?item.from:$t('wallet.cSystemInfo')}}</span>
                <span v-if="search==='nep55'">{{item.from?item.from:$t('wallet.bSystemInfo')}}</span>
              </span>
              <el-button v-if="item.from"
                         class="small-btn"
                         type="primary"
                         plain
                         v-clipboard:copy="item.from"
                         v-clipboard:success="onCopy"
                         v-clipboard:error="onError">{{$t('global.copy')}}
              </el-button>
            </template>
          </div>
        </div>

        <!--global transfer-->
        <div v-if="search==='global'">
          <div v-for="item in historyList"
               :class="['history-global',
                        {'history-is-expanded':item.expanded}]"
               :name="item.txid"
               :key="item.txid">
            <div class="history-global-title" @click="handleGlobalDetail(item)">
              <span class="fl"><b style="margin-right: 10px">Txid</b>{{item.txid}}</span>
              <i class="fr el-icon-arrow-right expanded"></i>
              <span class=" fr" style="margin-right: 20px">{{item.date}}</span>
            </div>
            <div class="history-global-content" v-loading="item.loading" v-if="item.expanded">
              <div class="history-global-content__type">
                <span>{{$t('wallet.category.tranType')}}： <b class="green">{{item.type}}</b></span>
              </div>
              <div class="history-global-content__detail">
                <div class="history-global-content__detail-in">
                  <div v-for="(vin,vIndex) in item.vin"
                       v-if="item.vin.length>0"
                       :key="vIndex">
                    {{vin.address}}
                    <span class="from"> -{{vin.value | numFormat}}</span>
                    <span class="from">{{vin.name}}</span>
                  </div>
                </div>
                <div class="history-global-content__detail-transfer">
                  <i class="el-icon-arrow-right" style="font-size: 18px"></i>
                </div>
                <div class="history-global-content__detail-out">
                  <div v-for="(vout,outIndex) in item.vout"
                       v-if="item.vout.length>0"
                       :key="outIndex">
                    {{vout.address}}
                    <span class="to">+{{vout.value | numFormat}}</span>
                    <span class="to">{{vout.name}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="transfer-history-none">
        <img class="img" src="~/assets/img/noData.png" alt="">
        <div class="txt">{{$t('global.noData')}}</div>
      </div>

      <!--pagination-->
      <div class="pagination-container clearfix" v-if="totalPage>0">
        <el-pagination background
                       layout="prev, pager, next"
                       :page-size='perPageNum'
                       :current-page="currentPage"
                       @current-change="handleCurrentChange"
                       :total="totalPage"></el-pagination>
        <div class="pagination-number">
          <span style="margin-right: 10px">{{$t('global.perPageNum')}}</span>
          <el-select v-model="perPageNum" size="small" style="width: 100px">
            <el-option v-for="item in perPageNumList"
                       :label="item+' '+$t('global.row')"
                       :value="item"
                       :key="item"></el-option>
          </el-select>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
  import {formatTime} from '../../utils'
  import {getBlockTime} from '../../api/global'
  import clipboard from '../../mixins/clipboard'
  import getSarAddr from '../../mixins/getSarAddr'
  import {mapGetters} from 'vuex'
  import {find, forEach, cloneDeep, filter} from 'lodash'
  import {numFormat} from '../../filters'
  import {
    getNep5Transfer,
    getNep5TransferCount,
    getNep55Transfer,
    getNep55TransferCount,
    getGlobalTransfer,
    getGlobalTransferCount,
    getGlobalTransferDetail,
    getAllNep5Hash
  } from '../../api/wallet'

  export default {
    name: 'TransferDetail',
    data() {
      return {
        loading: true,
        historyList: null,
        search: 'sdusd',
        currentPage: 1,
        perPageNum: 10,
        totalPage: 0,
        perPageNumList: [10, 20, 30, 50, 100],
        currentSarAddr: null,
        oldAllTxid: [],
        loadingGlobalDetail: true,
      }
    },
    computed: {
      ...mapGetters([
        'currentUser',
      ])
    },
    mixins: [clipboard, getSarAddr],
    filters: {
      numFormat,
    },
    async created() {
      await this.getCurrentHash();
      await this.launchSdusdTransfer();
    },
    methods: {
      //toggle transfer type
      async launchSdusdTransfer() {
        this.search = 'sdusd';
        this.loading = true;
        this.historyList = null;
        this.getSdusdCount();
        await this.getNep5Transfer();
      },
      async launchNep5Transfer() {
        this.loading = true;
        this.search = 'nep5';
        this.historyList = null;
        this.getNep5Count();
        await this.getNep5Transfer();
      },
      async launchNep55Transfer() {
        this.search = 'nep55';
        this.loading = true;
        this.historyList = null;
        this.getNep55Count();
        await this.getNep55Transfer();
      },
      async launchGlobalTransfer() {
        this.search = 'global';
        this.loading = true;
        this.historyList = null;
        this.getGlobalCount();
        await this.getGlobalTransfer();
      },

      //get all nep5 hash
      async getCurrentHash() {
        let _sarAddr = await getAllNep5Hash();
        let sarAddr = _sarAddr.result ? _sarAddr.result : [];
        this.currentSarAddr = sarAddr;
      },

      //get transfer list
      async getNep5Transfer() {
        let params;
        if (this.search === 'nep5') {
          params = [this.currentUser.address, this.perPageNum, this.currentPage];
        }
        if (this.search === 'sdusd') {
          params = [this.currentUser.address, this.sarAddr.sdusd.hash, this.perPageNum, this.currentPage];
        }
        let _historyList = await getNep5Transfer(params);
        let historyList = _historyList.result;
        if (!historyList) {
          this.loading = false;
          return;
        }

        let sarAddr = this.currentSarAddr;

        //add date,time,isFrom
        for (let i = 0, len = historyList.length; i < len; i++) {
          let item = historyList[i];
          let tempObj = find(sarAddr, o => o.assetid === item.asset);
          item.name = tempObj ? tempObj.symbol : '';
          item.isFrom = this.currentUser.address === item.from;
          //get time //get time
          let blockTime = await getBlockTime([item.blockindex]);
          if (blockTime.result) {
            item.date = formatTime((blockTime.result[0].time * 1000), true);
          }
        }
        this.historyList = historyList;
        this.loading = false;
      },
      async getNep55Transfer() {
        let params = [this.currentUser.address, this.perPageNum, this.currentPage];
        let _historyList = await getNep55Transfer(params);
        let historyList = _historyList.result;
        if (!historyList) {
          this.loading = false;
          return;
        }

        //add date,time,isFrom
        forEach(historyList, item => {
          item.isFrom = this.currentUser.address === item.from;
          item.date = formatTime((item.blocktime.$date), true);
        });
        this.historyList = historyList;
        this.loading = false;
      },
      async getGlobalTransfer() {
        let params = [this.currentUser.address, this.perPageNum, this.currentPage];
        let _historyList = await getGlobalTransfer(params);
        let historyList = _historyList.result;
        if (!historyList) {
          this.loading = false;
          return;
        }
        forEach(historyList, item => {
          item.date = formatTime((item.blocktime.$date), true);
        });
        this.historyList = historyList;
        this.loading = false;
      },

      //get transfer count
      getSdusdCount() {
        let params = [this.currentUser.address, this.sarAddr.sdusd.hash];
        getNep5TransferCount(params).then(res => {
          this.totalPage = parseInt(res.result[0].transfercount);
        }).catch(() => {
          this.totalPage = 0;
        })
      },
      getNep5Count() {
        let params = [this.currentUser.address];
        getNep5TransferCount(params).then(res => {
          this.totalPage = parseInt(res.result[0].transfercount);
        }).catch(() => {
          this.totalPage = 0;
        })
      },
      getNep55Count() {
        let params = [this.currentUser.address];
        getNep55TransferCount(params).then(res => {
          this.totalPage = parseInt(res.result[0].transfercount);
        }).catch(() => {
          this.totalPage = 0;
        })
      },
      getGlobalCount() {
        let params = [this.currentUser.address];
        getGlobalTransferCount(params).then(res => {
          this.totalPage = parseInt(res.result[0].transcount);
        }).catch(() => {
          this.totalPage = 0;
        })
      },

      //page change
      handleCurrentChange(val) {
        this.loading = true;
        this.currentPage = val;
        this.getChangeList();
      },
      getChangeList() {
        switch (this.search) {
          case 'sdusd':
            this.launchSdusdTransfer();
            break;
          case 'nep5':
            this.launchNep5Transfer();
            break;
          case 'nep55':
            this.launchNep55Transfer();
            break;
          case 'global':
            this.launchGlobalTransfer();
            break;
        }
      },

      //get global transfer detail by txid
      async handleGlobalDetail(obj) {
        //flexible btn
        if (obj.expanded) {
          obj.expanded = !obj.expanded;
        } else {
          this.$set(obj, 'expanded', true);
        }

        if (obj.detail) {
          return;
        }

        //get detail
        this.$set(obj, 'loading', true);
        let _globalDetail = await getGlobalTransferDetail([obj.txid]);
        let globalDetail = _globalDetail.result;
        if (!globalDetail) {
          obj.loading = false;
          return;
        }
        this.$set(obj, 'detail', globalDetail[0]);
        this.$set(obj, 'type', globalDetail[0].type);

        //vout
        let vout = cloneDeep(globalDetail[0].vout);
        this.$set(obj, 'vout', this.filterNeoOrGas(vout));

        //vin
        let vin = cloneDeep(globalDetail[0].vin);
        let inResult = [];
        for (let i = 0, len = vin.length; i < len; i++) {
          let item = vin[i];
          let _vinResult = await getGlobalTransferDetail([item.txid]);
          let vinResult = _vinResult.result;
          if (!vinResult) {
            return;
          }
          let _outResult = filter(vinResult[0].vout, o => o.n === item.vout);
          inResult = inResult.concat(_outResult);
        }
        this.$set(obj, 'vin', this.filterNeoOrGas(inResult));
        obj.loading = false;
      },
      filterNeoOrGas(arr) {
        if (!Array.isArray(arr)) {
          return;
        }
        for (let i = 0, len = arr.length; i < len; i++) {
          let item = arr[i];
          //judge is neo or gas
          for (let key in eNeo.config) {
            if (eNeo.config[key] === item.asset) {
              if (key === 'neoId') {
                item.name = 'NEO';
              }
              if (key === 'neoGasId') {
                item.name = 'GAS';
              }
            }
          }
          item.isFrom = this.currentUser.address === item.address;
        }
        return arr;
      }
    },
    watch: {
      perPageNum() {
        this.loading = true;
        this.currentPage = 1;
        this.getChangeList();
      },
      search(newVal) {
        if (newVal) {
          this.currentPage = 1;
          this.totalPage = 0;
          this.getChangeList();
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/var";
  @import "../../assets/styles/mixin";
  .transfer-history {
    &-search {
      padding: 10px 0;
    }
    &-none {
      text-align: center;
      background: #fff;
      padding: 70px 0;
      border: 1px solid $--border-color-base;
      border-top: 0;
      .img {
        height: 129px;
      }
      .txt {
        color: #99a;
        margin-top: 13px;
      }
    }
    &-data {
      padding-bottom: 10px;
    }
    &-item {
      margin-bottom: 10px;
      background: #fff;
      border: 1px solid $--border-color-base;
      border-radius: $--border-radius-small;
      padding: 16px 20px;
      color: #666677;
      .time {
        font-size: 12px;
        line-height: 36px;
        border-bottom: 1px solid $--border-color-base;
      }
      .detail {
        line-height: 40px;
        .from {
          color: $--color-danger;
          margin-right: 30px;
          font-weight: bold;
          font-size: 18px;
        }
        .to {
          color: $--color-success;
          margin-right: 30px;
          font-weight: bold;
          font-size: 18px;
        }
        .small-btn {
          margin-left: 20px;
        }
      }
    }
    .history-global {
      margin-bottom: 10px;
      border: 1px solid $--border-color-base;
      border-radius: $--border-radius-small;
      color: #666677;
      &.history-is-expanded {
        .expanded {
          transform: rotate(90deg);
        }
      }
      .expanded {
        transition: transform .3s;
      }
      &-title {
        cursor: pointer;
        @include clearfix;
        padding: 16px 20px;
        background: #fff;
      }
      &-content {
        padding: 16px 20px;
        border-top: 1px solid $--border-color-base;
        background: #EFEFF8;
        &__type {
          border-bottom: 1px solid #ddd;
          height: 30px;
          line-height: 30px;
        }
        &__detail {
          @include clearfix;
          margin-top: 10px;
          line-height: 20px;
          &-in {
            display: inline-block;
            vertical-align: middle;
            width: 558px;
          }
          &-transfer {
            display: inline-block;
            vertical-align: middle;
            text-align: center;
            width: 42px;
          }
          &-out {
            display: inline-block;
            vertical-align: middle;
            width: 558px;
            text-align: right;
          }

          .from {
            color: $--color-danger;
            padding-left: 10px;
            font-weight: bold;
          }
          .to {
            color: $--color-success;
            padding-left: 10px;
            font-weight: bold;
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  @import "../../assets/styles/var";

  .transfer-history {
    &.el-card {
      border: 0;
    }
    .el-card__header {
      border: 1px solid $--border-color-base;
      border-top-left-radius: $--border-radius-small;
      border-top-right-radius: $--border-radius-small;
    }
    .el-card__body {
      padding: 0 !important;
      background: #f6f6fa;
    }
    .history-global {
      .el-collapse-item__content {
        padding-bottom: 0;
      }
    }
  }
</style>
