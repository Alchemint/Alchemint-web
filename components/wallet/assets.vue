<template>
  <div class="assets mt-30">
    <el-card class="border-card assets-info">
      <div slot="header" class="border-card-header">
        <span class="border-card-header__title">{{$t('wallet.walletInfo')}}</span>
      </div>
      <div class="wallet-info">
        <div class="wallet-info__item">
          <div class="wallet-info__title">{{$t('wallet.myAddr')}}
            <el-button type="primary"
                       class="small-btn"
                       style="margin-left: 32px"
                       v-clipboard:copy="currentUser.address"
                       v-clipboard:success="onCopy"
                       v-clipboard:error="onError">{{$t('global.copy')}}
            </el-button>
          </div>
          <div class="wallet-info__content"><span v-text="currentUser.address"></span>
            <el-popover popper-class="qr-popover" placement="right" title="" width="100" trigger="click">
              <img slot="reference" class="qr-control" src="~/assets/img/qrcode.png" alt="qrCode">
              <img id="qrCodeImg"
                   src="~/assets/img/logo.png"
                   class="qr-img"
                   alt="qrCode">
            </el-popover>
          </div>
        </div>
        <div class='wallet-info__item mt-30'>
          <div class="wallet-info__title">{{$t('wallet.myWif')}}
            <el-radio-group class="current-wif-btn" v-model="hideDisplay" size="mini">
              <el-radio-button :label="false">{{$t('global.hide')}}</el-radio-button>
              <el-radio-button :label="true">{{$t('global.display')}}</el-radio-button>
            </el-radio-group>
          </div>
          <div class="wallet-info__content">
            <span>{{currentUser.wif | filterWif(hideDisplay)}}</span>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="border-card mt-30">
      <div slot="header" class="border-card-header">
        <span class="border-card-header__title">{{$t('wallet.assetBalance')}}</span>
        <span class="border-card-header__totalVal">(${{totalVal | numFormat}})</span>
      </div>
      <el-table class="no-border-table cell-first-highlight"
                stripe
                :data="assets"
                v-loading="loading"
                :row-class-name="setRowStyle"
                :cell-class-name="setCellStyle"
                :element-loading-text="$t('global.loading')"
                element-loading-spinner="el-icon-loading"
                style="width: 100%">
        <el-table-column prop="symbol"
                         :label="$t('wallet.currency')"
                         width="200"></el-table-column>
        <el-table-column prop="showBalance"
                         :label="$t('wallet.balance')"
                         align="right"
                         width="200">
          <template slot-scope="scope">
            {{scope.row.showBalance | numFormat}}
          </template>
        </el-table-column>
        <el-table-column prop="showPrice"
                         :label="$t('wallet.unitPrice')"
                         align="right"
                         width="300">
          <template slot-scope="scope">
            ${{scope.row.showPrice | numFormat}}
          </template>
        </el-table-column>
        <el-table-column prop="totalVal"
                         :label="$t('wallet.totalValue')"
                         align="right"
                         min-width="150">
          <template slot-scope="scope">
            ${{scope.row.totalVal | numFormat}}
          </template>
        </el-table-column>
        <el-table-column align="right" width="100">
          <template slot-scope="scope">
            <el-button type="danger"
                       plain
                       class="small-btn"
                       @click.native="resuceSarShow(scope.row)"
                       v-if="scope.row.type==='nep55' && Number(scope.row.status)===3">
              {{ $t('global.liquidate')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--清算模态框-->
    <el-dialog class="sar-modal settle-modal"
               :title="$t('wallet.liquidate.title')"
               width="360px"
               label-position="top"
               center
               :show-close="false"
               stripe
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="resuceModal">
      <div class="asset-liquidate" v-if="currentAsset">
        <div class="asset-liquidate-item clearfix">
          <span class="fl">{{$t('wallet.liquidate.sar')}}</span>
          <span class="fr">
            <b class="green">{{currentAsset.showBalance}} {{currentAsset.name}}</b>
            (${{currentAsset.totalVal}})
          </span>
        </div>
        <div class="mt-40 asset-liquidate-item clearfix">
          <span class="fl">{{$t('wallet.liquidate.sds')}}</span>
          <span class="fr">
            <b class="green">{{sdsNum}} SDS</b>
            (${{sdsTotalVal}})
          </span>
        </div>
      </div>
      <div slot="footer">
        <el-button class="sar-modal-btn" @click="resuceModal = false">
          {{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn" type="primary" :disabled="disabled" @click="resuceSar">
          {{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  let qrCode = require('qrcode');
  import sarAddr from '../../mixins/getSarAddr'
  import {sendDrawTransaction} from '../../api/global'
  import checkTxid from '../../mixins/checkTxid'
  import {bigmath, formatPrecision, printNumber} from '../../utils'
  import getSarB from '../../mixins/getSarB'
  import getSarConfig from '../../mixins/getSarConfig'
  import clipboard from '../../mixins/clipboard'
  import {forEach} from 'lodash'
  import {numFormat} from '../../filters'

  export default {
    name: 'WalletAssets',
    props: {
      assets: {
        required: true,
      },
      currentUser: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        hideDisplay: false,
        currentAsset: null,
        sdsNum: '',
        sdsTotalVal: '',
        resuceModal: false,
        disabled: false,
      }
    },
    computed: {
      loading() {
        return this.assets ? false : true;
      },
      totalVal() {
        if (this.assets) {
          let val = 0;
          forEach(this.assets, item => {
            val += Number(item.totalVal);
          });
          return formatPrecision(val, 3);
        }
        return formatPrecision(0, 3);
      }
    },
    mixins: [sarAddr, checkTxid, getSarB, getSarConfig, clipboard],
    mounted() {
      qrCode.toDataURL(this.currentUser.address, {errorCorrectionLevel: 'H'}, function (err, url) {
        document.getElementById('qrCodeImg').src = url;
      });
    },
    filters: {
      filterWif(val, hideDisplay) {
        if (hideDisplay) {
          return val;
        }
        return val.replace(/./g, '*');
      },
      numFormat,
    },
    methods: {
      async resuceSarShow(item) {
        this.resuceModal = true;
        this.currentAsset = item;
        let tempObj = await this.getSarB(item.owner);
        let sdsNum = bigmath.chain(bigmath.bignumber(item.balance))
          .multiply(bigmath.bignumber(tempObj.sarLocked))
          .divide(bigmath.bignumber(tempObj.sarHasDrawed))
          .done();
        this.sdsNum = formatPrecision(
          printNumber(sdsNum), 3
        );

        let sarConfig = await this.getSarConfig();
        this.sdsTotalVal = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sdsNum))
              .multiply(bigmath.bignumber(sarConfig.sds_price))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 3
        )
      },
      async resuceSar() {
        if (this.disabled) {
          return;
        }
        this.disabled = true;

        let {wif, address} = this.currentUser;
        let scAddr = this.sarAddr.sarB.hash;
        let sarAddr = this.currentAsset.owner;
        let type = 'redeem';
        let params = [
          "(addr)" + address,
          "(addr)" + sarAddr
        ];

        let r = eNeo.callC(wif, scAddr, type, params);

        sendDrawTransaction([r.rawData]).then(draw => {
          this.checkTxid(r, draw, () => {
            this.resuceModal = false;
            this.disabled = false;
            this.claimRedeemSds();
          });
        }).catch(() => {
          this.disabled = false;
        })
      },
      claimRedeemSds() {
        this.$alert(`${this.sdsNum}($${this.currentAsset.totalVal})${this.$t('wallet.liquidate.info')}`, '提示', {
          confirmButtonText: this.$t('global.confirmBtn'),
          showClose: false,
          customClass: 'asset-alert',
          callback: () => {
            if (this.disabled) {
              return;
            }
            this.disabled = true;
            const loading = this.$loading({
              lock: true,
              text: '',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });

            let {wif, address} = this.currentUser;
            let scAddr = this.sarAddr.sarB.hash;
            let type = 'claimRedeem';
            let params = [
              "(addr)" + address,
            ];

            let r = eNeo.callC(wif, scAddr, type, params);

            sendDrawTransaction([r.rawData]).then(draw => {
              this.checkTxid(r, draw, () => {
                loading.close();
                location.reload();
              });
            })
          }
        });
      },
      setRowStyle(row) {
        if (row.row.status === 3) {
          return 'red'
        }
      },
      setCellStyle(row) {
        if (row.row.status === 3 && row.columnIndex === 0) {
          return 'red';
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/var";

  .assets {
    .border-card-header__totalVal {
      display: inline-block;
      vertical-align: middle;
      margin-left: 6px;
    }
    .wallet-info {
      &__title {
        font-size: 12px;
        color: #9090AB;
      }
      &__content {
        margin-top: 14px;
        font-size: 14px;
        font-weight: bold;
      }
      .qr-control {
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }

  .asset-liquidate {
    padding: 85px 20px 50px;
    color: #667;
    &-item {
      line-height: 20px;
      border-bottom: 1px solid $--border-color-base;
    }
  }
</style>

<style lang="scss">
  .current-wif-btn {
    font-size: 12px;
    margin-left: 20px;
    .el-radio-button__inner {
      padding: 2px 4px !important;
      font-size: 12px !important;
      border-radius: 2px !important;
    }
  }

  .qr-popover {
    min-width: 100px !important;
    height: 100px !important;
    padding: 2px 0 !important;
    text-align: center;
    .qr-img {
      width: 96px;
      height: 96px;
    }
  }

  .assets-info {
    .el-card__body {
      padding: 20px 0 30px 40px !important;
    }
  }

  .el-icon-caret-right {
    display: inline-block;
    width: 16px;
    margin: 0 17px;
  }

  .asset-alert {
    .el-message-box__header {
      display: none;
    }
  }
</style>

