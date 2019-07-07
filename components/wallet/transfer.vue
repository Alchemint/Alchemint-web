<template>
  <div class="transfer mt-30">
    <!--转账-->
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
      <el-form ref='transferForm'
               class="transfer-form"
               :rules="rules"
               :model="formData"
               label-position="top">
        <el-form-item :label="$t('wallet.transferAsset')">
          <el-select v-model="formData.id" style="width: 450px" @change="handleAssetChange">
            <el-option v-for="item in allAssets"
                       :label="item.symbol+'（'+setDp(item.balance)+'）'"
                       :key="item.id"
                       :value="item.id">
              <span class="fl">{{item.symbol}}</span>
              <span class="fr">{{item.balance}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('wallet.toAddress')" prop="toAddress">
          <el-input v-model.trim="formData.toAddress" :placeholder="$t('wallet.toAddressPhl')">
            <span slot="suffix">
              <icon-font name="icon-fuzhi"
                         style="font-size:18px"
                         v-clipboard:copy="formData.toAddress"
                         v-clipboard:success="onCopy"
                         v-clipboard:error="onError"></icon-font>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('wallet.amount')" prop="amount">
          <el-input v-model.number="formData.amount" :placeholder="$t('wallet.amountPhl')">
            <span slot="suffix" @click="handleAllAsset">{{$t('global.all')}}</span>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('global.fee')">
          <el-checkbox v-model="formData.needFee">{{$t('global.feeInfo')}}</el-checkbox>
        </el-form-item>
        <el-form-item class="align-center mt-30">
          <el-button type="primary"
                     class="confirm-btn"
                     @click="popTransferConfirmModal">{{$t('global.confirmBtn')}}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--转账记录-->
    <transfer-detail ref="transferDetail"></transfer-detail>

    <!--确认转账模态框-->
    <el-dialog class="sar-modal wallet-transfer-modal"
               :title="$t('wallet.transferModal.title')"
               width="360px"
               label-position="top"
               center
               :show-close="false"
               :lock-scroll="false"
               stripe
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="transferConfirmModal">
      <div class="wallet-transfer-modal__content">
        <div class="item">
          <div>{{$t('wallet.transferModal.amount')}}</div>
          <div class="detail">{{setDp(formData.amount)}}&nbsp;{{formData.symbol}}</div>
        </div>
        <div class="item">
          <div>{{$t('wallet.transferModal.to')}}</div>
          <div class="detail">{{formData.toAddress}}</div>
        </div>
        <div class="item">
          <div>{{$t('global.fee')}}</div>
          <div class="detail">{{formData.needFee?'0.001':'0'}}GAS</div>
        </div>
        <div v-if="transferErr" class="warn-info">
          <i class="el-icon-warning"></i>
          <span>&nbsp;{{transferErr}}</span>
        </div>
      </div>
      <div slot="footer">
        <el-button class="sar-modal-btn" @click="cancelTransferModal">
          {{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn"
                   type="primary"
                   @click="handleConfirm">
          {{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--硬件钱包签名弹框-->
    <cold-wallet-dialog :cold-wallet-dialog-visible="coldWalletDialogVisible"></cold-wallet-dialog>
  </div>
</template>

<script>
  import {find, forEach} from 'lodash'
  import checkTxid from '~/mixins/checkTxid'
  import {sendDrawTransaction, getUtxo} from '~/api/global'
  import clipboard from '~/mixins/clipboard'
  import getSarAddr from '~/mixins/getSarAddr'
  import transferDetail from './transferDetail'
  import getLeaderPubkey from '~/mixins/getLeaderPubkey'
  import {decimalPlaces} from '~/filters/core'
  import {BN, setDp} from '~/utils/core'
  import {LOADING_OPTION, EIGHT_POWER} from '~/filters/const'

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
          id: '',
          needFee: false,
        },
        rules: {
          toAddress: {validator: this.validateAddress, trigger: 'blur'},
          amount: {validator: this.validateAmount, trigger: 'change'},
        },
        amountMax: 0, //当前资产数量
        loading: true,
        btnLocked: false, //按钮锁定,避免多次弹框
        transferConfirmModal: false, //再次转账弹框
        transferErr: '',
        needFee: false,
      }
    },
    computed: {
      allAssets() {
        if (this.assets) {
          return this.assets.map((item, index) => {
            let obj = {
              id: `${item.symbol}_${item.assetid}`
            }
            return Object.assign(item, obj);
          });
        }
      }
    },
    components: {
      transferDetail
    },
    mixins: [
      checkTxid,
      clipboard,
      getSarAddr,
      getLeaderPubkey
    ],
    filters: {
      decimalPlaces
    },
    async mounted() {
      let firstAsset = this.allAssets[0];
      this.formData.id = firstAsset.id;
      this.formData.symbol = firstAsset.symbol;
      this.formData.assetid = firstAsset.assetid;
      this.amountMax = firstAsset.balance;
    },
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

      //验证address
      validateAddress(rule, value, callback) {
        let locale = this.$i18n.locale;
        if (value === '') {
          callback(new Error(locale === 'zh' ? '地址不能为空' : 'The address cannot be empty'));
        } else if (!this.verifyAddr(value)) {
          callback(new Error(locale === 'zh' ? '地址不符合要求' : 'The address does not meet the requirements'));
        } else {
          callback();
        }
      },

      //验证amount
      validateAmount(rule, value, callback) {
        let locale = this.$i18n.locale;
        let currentAsset = find(this.allAssets, o => o.symbol === this.formData.symbol && o.assetid === this.formData.assetid);
        let maxAmount = currentAsset ? currentAsset.balance : 0;
        value = +value;
        let decimals = new BN(value).dp();

        if (value === 0) {
          callback(new Error(locale === 'zh' ? '转账金额不能为0' : 'The transfer amount cannot be 0'));
        } else if (value > maxAmount) {
          callback(new Error(locale === 'zh' ? '转账金额不能大于资产余额' : 'The transfer amount cannot be greater than the balance'));
        } else if (decimals > 8) {
          callback(new Error(locale === 'zh' ? '转账金额不能超过小数点后8位' : 'The transfer amount cannot exceed 8 decimal places'));
        } else if (this.formData.symbol === 'NEO' && !Number.isInteger(value)) {
          callback(new Error(locale === 'zh' ? 'NEO转账数量必须是整数' : 'NEO transfer amount only allows integers'));
        } else {
          callback();
        }
      },

      //弹出转账确认模态框
      popTransferConfirmModal() {
        this.$refs['transferForm'].validate((valid) => {
          if (valid) {
            this.transferConfirmModal = true;
          } else {
            return false;
          }
        });
      },

      //变换资产,amount重置为0;
      handleAssetChange(val) {
        let arr = val.split('_');
        let assetid = arr[1];
        let symbol = arr[0];
        let tempObj = find(this.assets, o => o.assetid === assetid && o.symbol === symbol);
        this.amountMax = tempObj.balance;
        this.formData.symbol = symbol;
        this.formData.assetid = assetid;
        this.formData.amount = 0;
      },

      //当前资产余额全部转账
      handleAllAsset() {
        this.formData.amount = this.amountMax;
      },

      //发行转账签名
      async handleConfirm() {
        if (this.btnLocked) {
          return;
        }
        this.btnLocked = true;

        const loading = this.$loading(LOADING_OPTION);

        //获取签名数据
        let {symbol, toAddress, amount, needFee} = this.formData;
        let tempObj = find(this.assets, o => o.symbol === symbol);
        let {type, assetid} = tempObj;
        let {address, wif} = this.currentUser;
        let utxo = await getUtxo([address]);
        let r;
        let payfee = needFee ? '0.001' : false;

        //全局资产
        if (type === 'global') {
          amount = +amount;
          if (utxo.result) {
            //获取签名信息
            let tempObj = {
              wif,
              utxos: utxo.result ? utxo.result : null,
              scAddr: assetid,
              toAddress,
              amount,
            };
            r = await this.getSignature("transferglobalcoin", tempObj, payfee, loading);
          }
        }

        //nep5资产
        if (type === 'nep5') {
          amount = new BN(amount).times(EIGHT_POWER).integerValue().toString();

          //获取签名信息
          let tempObj = {
            wif,
            utxos: utxo.result ? utxo.result : null,
            scAddr: assetid,
            toAddress,
            amount
          };
          r = await this.getSignature('transfernep5', tempObj, payfee, loading);
        }

        //nep55资产
        if (type === 'nep55') {
          amount = new BN(amount).times(EIGHT_POWER).integerValue().toString();
          let method = 'transfer';
          let params = [
            "(str)" + symbol,
            "(address)" + address,
            "(address)" + toAddress,
            "(integer)" + amount
          ];
          let tempObj = {
            wif,
            utxos: utxo.result ? utxo.result : null,
            scAddr: assetid,
            type: method,
            params
          };
          r = await this.getSignature("callc", tempObj, payfee, loading);
        }
        if (!r) {
          this.btnLocked = false;
          this.transferErr = this.$t('wallet.errAddr');
          loading.close();
          return;
        }

        let draw = await sendDrawTransaction([r.rawData]);
        if (!draw) {
          this.btnLocked = false;
          this.transferErr = '';
          loading.close();
          return;
        }
        this.checkTxid(r, draw, () => {
          this.updateViewData();
          this.transferConfirmModal = false;
          this.btnLocked = false;
          this.transferErr = '';
          loading.close();
        })
      },

      cancelTransferModal() {
        this.transferConfirmModal = false;
        this.transferErr = '';
      },

      //更新数据
      updateViewData() {
        //更新assets,
        this.$emit('update-assets');

        //更新列表数据
        let transferDetail = this.$refs.transferDetail;
        let search = transferDetail.search;
        switch (search) {
          case'sdusd':
            transferDetail.launchSdusdTransfer();
            break;
          case 'nep5':
            transferDetail.launchNep5Transfer();
            break;
          case 'nep55':
            transferDetail.launchNep55Transfer();
            break;
          case 'global':
            transferDetail.launchGlobalTransfer();
            break;
        }
      },
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

  .wallet-transfer-modal {
    &__content {
      color: #99a;
      padding: 10px;

      .item {
        margin-top: 30px;
      }

      .detail {
        margin-top: 10px;
        color: #334;
        font-weight: bold;
      }

      .warn-info {
        font-size: 12px;
        color: $--color-danger;
        margin-top: 10px;
      }
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
