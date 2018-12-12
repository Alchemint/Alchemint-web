<template>
  <div class="transfer mt-30">
    <el-card class="border-card">
      <div slot="header" class="border-card-header">
        <span class="border-card-header__title">{{$t('wallet.transfer')}}</span>
        <el-tooltip popper-class="global-popper"
                    placement="bottom-start"
                    offset="100"
                    effect="light">
          <div slot="content" style="width: 320px">
            {{$t('wallet.transferInfo')}}
          </div>
          <icon-font name="icon-wenhao" class="green transfer-info"></icon-font>
        </el-tooltip>
      </div>
      <el-form class="transfer-form" :model="formData" label-position="top">
        <el-form-item :label="$t('wallet.transferAsset')">
          <el-select v-model="formData.symbol" style="width: 450px" @change="handleAssetChange">
            <el-option v-for="item in assets"
                       :label="item.symbol+'（'+item.balance+'）'"
                       :key="item.symbol"
                       :value="item.symbol">
              <span class="fl">{{item.symbol}}</span>
              <span class="fr">{{item.balance | numFormat}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('wallet.toAddress')">
          <el-input v-model="formData.toAddress" :placeholder="$t('wallet.toAddressPhl')">
            <span slot="suffix">
              <icon-font name="icon-fuzhi"
                         style="font-size:18px"
                         v-clipboard:copy="formData.toAddress"
                         v-clipboard:success="onCopy"
                         v-clipboard:error="onError"></icon-font>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('wallet.amount')">
          <el-input v-model.number="formData.amount" :placeholder="$t('wallet.amountPhl')">
            <span slot="suffix" @click="handleAllAsset">{{$t('global.all')}}</span>
          </el-input>
        </el-form-item>
        <el-form-item class="align-center mt-30">
          <el-button type="primary"
                     class="confirm-btn"
                     :disabled="confirmBtn"
                     @click="handleConfirm">{{$t('global.confirmBtn')}}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <transfer-detail></transfer-detail>
  </div>
</template>

<script>
  import {find, forEach} from 'lodash'
  import checkTxid from '../../mixins/checkTxid'
  import {sendDrawTransaction, getUtxo} from '../../api/global'
  import {bigmath, formatPrecision, printNumber} from '../../utils'
  import clipboard from '../../mixins/clipboard'
  import getSarAddr from '../../mixins/getSarAddr'
  import transferDetail from './transferDetail'
  import {numFormat} from '../../filters'

  export default {
    name: 'WalletTransfer',
    props: {
      assets: {
        type: Array,
        required: true,
      },
      currentUser: {
        type: Object,
        required: true,
      }
    },
    data() {
      return {
        formData: {
          symbol: '',
          toAddress: '',
          amount: 0,
        },
        amountMax: 0,
        historyList: null,
        loading: true,
        disabled: false,
      }
    },
    computed: {
      confirmBtn() {
        let {toAddress, amount} = this.formData;
        if (!toAddress) {
          return true;
        }
        if (Number(amount) === 0) {
          return true;
        }
        if (amount > this.amountMax) {
          return true;
        }
        return false;
      }
    },
    components: {
      transferDetail,
    },
    mixins: [checkTxid, clipboard, getSarAddr],
    filters: {
      numFormat,
    },
    mounted() {
      this.formData.symbol = this.assets[0].symbol;
      this.amountMax = find(this.assets, o => o.symbol === this.formData.symbol).balance;
    },
    methods: {
      handleAssetChange(val) {
        this.amountMax = find(this.assets, o => o.symbol === val).balance;
        this.formData.amount = 0;
      },
      handleAllAsset() {
        this.formData.amount = this.amountMax;
      },
      async handleConfirm() {
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

        let {symbol, toAddress, amount} = this.formData;

        //get txid
        let tempObj = find(this.assets, o => o.symbol === symbol);
        let {type, decimals, assetid} = tempObj;
        let {address, wif} = this.currentUser;
        let r;
        if (type === 'global') {
          amount = +amount;
          let utxo = await getUtxo([address]);
          if (utxo.result) {
            try {
              r = await eNeo.transferGlobalCoin(wif, utxo.result, assetid, toAddress, amount);
            } catch (e) {
              loading.close();
              this.disabled = false;
              this.$message.error(this.$t('wallet.errAddr'))
            }
          }
        }
        if (type === 'nep5') {
          amount = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(amount))
                .multiply(bigmath.bignumber(bigmath.pow(10, decimals)))
                .done()
            ), 0
          );
          try {
            r = await eNeo.transferNep5(wif, assetid, toAddress, amount);
          } catch (e) {
            loading.close();
            this.disabled = false;
            this.$message.error(this.$t('wallet.errAddr'))
          }
        }
        if (type === 'nep55') {
          amount = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(amount))
                .multiply(bigmath.bignumber(bigmath.pow(10, decimals)))
                .done()
            ), 0
          );
          let method = 'transfer';
          let params = [
            "(str)" + symbol,
            "(address)" + address,
            "(address)" + toAddress,
            "(integer)" + amount
          ];
          try {
            r = await eNeo.callC(wif, assetid, method, params);
          } catch (e) {
            loading.close();
            this.disabled = false;
            this.$message.error(this.$t('wallet.errAddr'))
          }
        }
        if (!r) {
          return;
        }

        let draw = await sendDrawTransaction([r.rawData]);
        this.checkTxid(r, draw, () => {
          loading.close();
          location.reload();
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/var";

  .transfer {
    &-info {
      margin-left: 8px;
      font-weight: normal;
      cursor: pointer;
    }
    &-form {
      width: 450px;
      &-inline {
        width: 160px;
        float: left;
      }
    }
    .confirm-btn {
      width: 160px;
    }
  }
</style>

<style lang="scss">
  @import "../../assets/styles/var";

  .transfer-form {
    .el-input--suffix {
      .el-input__inner {
        padding-right: 40px;
      }
      .el-input__suffix {
        width: 40px;
        border-left: 1px solid $--border-color-base;
        cursor: pointer;
        right: 0;
        color: #667;
        height: calc(100% - 2px) !important;
        top: 1px !important;
      }
    }
    .el-select .el-input__icon {
      color: #667 !important;
    }
  }
</style>
