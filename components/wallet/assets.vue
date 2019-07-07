<template>
  <div class="assets mt-30">
    <!--钱包信息-->
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
        <div class='wallet-info__item mt-30' v-if="!isColdWallet">
          <div class="wallet-info__title">{{$t('wallet.myWif')}}
            <el-button type="primary"
                       class="small-btn"
                       style="margin-left: 32px"
                       v-clipboard:copy="currentUser.wif"
                       v-clipboard:success="onCopy"
                       v-clipboard:error="onError">{{$t('global.copy')}}
            </el-button>
          </div>
          <div class="wallet-info__content">
            <span>{{currentUser.wif | filterWif(wifDisplay)}}</span>
            <icon-font class="icon-eyes"
                       :name="wifDisplay?'icon-yanjing':'icon-yanjing-bi'"
                       @click.native="wifDisplay = !wifDisplay"></icon-font>
          </div>
        </div>
      </div>
    </el-card>

    <!--账户资产-->
    <el-card class="border-card mt-30">
      <div slot="header" class="border-card-header">
        <span class="border-card-header__title">{{$t('wallet.assetBalance')}}</span>
        <span class="border-card-header__totalVal">(${{totalVal | decimalPlaces(3)}})</span>
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
        <el-table-column align="right" width="100">
          <template slot-scope="scope">
            <el-button type="danger"
                       plain
                       class="small-btn"
                       @click.native="liqSarModalShow(scope.row)"
                       v-if="scope.row.type==='nep55' && Number(scope.row.status)===3">
              {{ $t('global.liquidate')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--B端清算模态框-->
    <el-dialog class="sar-modal settle-modal"
               :title="$t('wallet.liquidate.title')"
               width="360px"
               label-position="top"
               center
               :show-close="false"
               stripe
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="liquidateModal">
      <div class="asset-liquidate" v-if="currentAsset">
        <div class="asset-liquidate-item clearfix">
          <span class="fl">{{$t('wallet.liquidate.sar')}}</span>
          <span class="fr">
            <b class="green">{{currentAsset.balance}} {{currentAsset.symbol}}</b>
            (${{currentAsset.value}})
          </span>
        </div>
        <div class="mt-40 asset-liquidate-item clearfix">
          <span class="fl">{{$t('wallet.liquidate.sds')}}</span>
          <span class="fr">
            <b class="green">{{usedSdsBalance}} SDS</b>
            (${{usedSdsValue}})
          </span>
        </div>
      </div>
      <div slot="footer">
        <el-button class="sar-modal-btn" @click="liquidateModal = false">
          {{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn" type="primary" @click="liquidateSar">
          {{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--硬件钱包弹框-->
    <cold-wallet-dialog :cold-wallet-dialog-visible="coldWalletDialogVisible"></cold-wallet-dialog>
  </div>
</template>

<script>
  let qrCode = require('qrcode');
  import getSarAddr from "~/mixins/getSarAddr";
  import {sendDrawTransaction} from '~/api/global'
  import checkTxid from '~/mixins/checkTxid'
  import clipboard from '~/mixins/clipboard'
  import {forEach, find} from 'lodash'
  import getLeaderPubkey from '~/mixins/getLeaderPubkey'
  import {setDp, BN} from '~/utils/core'
  import {decimalPlaces} from '~/filters/core'
  import {getsar4BDetailByAdd} from '~/api/institution'
  import {LOADING_OPTION} from '~/filters/const'
  import {mapGetters} from 'vuex'

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
        wifDisplay: false, //wif的显示隐藏
        currentAsset: null, //当前可清算的B端资产
        btnLocked: false, //按钮是否锁定,避免多次弹框
        usedSdsBalance: '', //当前可清算B端资产使用了多少sds
        usedSdsValue: '', //当前可清算B端资产使用sds的资产价值
        liquidateModal: false, //清算模态框
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
            val += Number(item.value);
          });
          return val;
        }
        return 0;
      },
      ...mapGetters(['typeB']),
    },
    mixins: [
      getSarAddr,
      checkTxid,
      clipboard,
      getLeaderPubkey
    ],
    mounted() {
      qrCode.toDataURL(this.currentUser.address, {errorCorrectionLevel: 'H'}, function (err, url) {
        document.getElementById('qrCodeImg').src = url;
      });
    },
    filters: {
      filterWif(val, wifDisplay) {
        if (wifDisplay) {
          return val;
        }
        return val.replace(/./g, '*');
      },
      decimalPlaces
    },
    methods: {
      setDp,

      //获取相关sds所占比例
      async liqSarModalShow(item) {
        this.liquidateModal = true;
        this.currentAsset = item;

        //获取当前Sar的状态
        let _sarB = await getsar4BDetailByAdd([item.owner, this.sarAddr.sarB.hash]);
        let sarB = _sarB.result;
        if (!sarB) {
          return;
        }
        sarB = sarB[0];
        //计算抵押了sds的数量和价值
        let usedSdsBalance = new BN(item.balance).times(sarB.locked).div(sarB.hasDrawed).toString();
        this.usedSdsBalance = usedSdsBalance;

        if (!this.typeB) {
          await this.$store.dispatch('getTypeB');
        }
        let sds_price = find(this.typeB, o => o.key === 'sds_price').value;
        let usedSdsValue = new BN(usedSdsBalance).times(sds_price).toString();
        this.usedSdsValue = usedSdsValue;
      },
      //发起B端清算
      async liquidateSar() {
        if (this.btnLocked) {
          return;
        }
        this.btnLocked = true;

        let {wif, address} = this.currentUser;
        let scAddr = this.sarAddr.sarB.hash;
        let sarAddr = this.currentAsset.owner;
        let type = 'redeem';
        let params = [
          "(addr)" + address,
          "(addr)" + sarAddr
        ];

        //获取签名信息
        let tempObj = {
          wif,
          scAddr,
          type,
          params,
        };
        let r = await this.getSignature("callc", tempObj);
        if (!r) {
          this.btnLocked = false;
          return;
        }

        sendDrawTransaction([r.rawData]).then(draw => {
          this.checkTxid(r, draw, () => {
            this.liquidateModal = false;
            this.btnLocked = false;
            this.claimRedeemSds();
          });
        }).catch(() => {
          this.btnLocked = false;
        })
      },
      //将sds转入账户
      async claimRedeemSds() {
        this.$alert(`${this.usedSdsBalance}($${this.currentAsset.value})${this.$t('wallet.liquidate.info')}`, '', {
          confirmButtonText: this.$t('global.confirmBtn'),
          showClose: false,
          customClass: 'asset-alert',
          callback: () => {
            if (this.btnLocked) {
              return;
            }
            this.btnLocked = true;
            const loading = this.$loading(LOADING_OPTION);

            let {wif, address} = this.currentUser;
            let scAddr = this.sarAddr.sarB.hash;
            let type = 'claimRedeem';
            let params = [
              "(addr)" + address,
            ];

            //获取签名信息
            let tempObj = {
              wif,
              scAddr,
              type,
              params,
            };
            this.getSignature("callc", tempObj).then(r => {
              if (!r) {
                loading.close();
                return;
              }
              sendDrawTransaction([r.rawData]).then(draw => {
                this.checkTxid(r, draw, () => {
                  loading.close();
                  location.reload();
                });
              })
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

      .icon-eyes {
        margin-left: 10px;
        font-size: 18px;
        color: $--color-primary;
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

