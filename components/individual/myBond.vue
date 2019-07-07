<template>
  <el-card class="border-card content-no-padding">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">{{$t('individual.myBond.title')}}</span>
    </div>
    <div class="bond">
      <div class="bond-top clearfix">
        <div class="bond-item">
          <div class="bond-item__val"
               v-if="mySar"
               :title="setDp(mySar.bondDrawed)">{{mySar.bondDrawed | decimalPlaces(2)}}
          </div>
          <div class="bond-item__val" v-else>--</div>
          <div class="bond-item__title">{{$t('individual.myBond.bondUsed')}}</div>
        </div>
        <div class="bond-item">
          <div class="bond-item__val"
               v-if="mySar"
               :title="mySar.bondLocked">{{mySar.bondLocked | decimalPlaces(2)}}
          </div>
          <div class="bond-item__val" v-else>--</div>
          <div class="bond-item__title">{{$t('individual.myBond.sneoLocked')}}</div>
        </div>
      </div>
      <div class="bond-bottom" v-if="mySar">
        <el-button type="primary"
                   plain
                   class="bond-btn"
                   :disabled="mySar.status!=='3'"
                   @click="opLiquidationModal">
          {{$t('individual.myBond.liquidate')}}
        </el-button>
        <el-button type="primary"
                   plain
                   class="bond-btn"
                   :disabled="Number(mySar.bondDrawed)<=0"
                   @click="opPayBackSarModal">
          {{$t('individual.myBond.payBack')}}
        </el-button>
        <el-button type="primary"
                   plain
                   class="bond-btn"
                   @click="getHistoryDetail">
          {{$t('individual.myBond.history')}}
        </el-button>
      </div>
    </div>

    <!--历史模态框-->
    <el-dialog class="sar-modal"
               :title="$t('individual.myBond.historyTitle')"
               width="1000px"
               label-position="top"
               :lock-scroll="false"
               center
               :show-close="true"
               stripe
               :visible.sync="historyModal">
      <history-detail v-if="historyList" :data="historyList" type="sarC"></history-detail>
    </el-dialog>

    <!--清算模态框-->
    <el-dialog class="sar-modal"
               :title="$t('individual.liquidateModal.title')"
               label-position="top"
               center
               :show-close="true"
               :lock-scroll="false"
               stripe
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :before-close="beforeLiquidationClose"
               :visible.sync="liquidationModal">
      <el-form ref="liquidationForm"
               label-position="top"
               :rules="rules"
               :model="liquidationForm"
               class="settle-form clearfix">
        <el-form-item :label="$t('individual.liquidateModal.bondAmount')" class="fl" prop="bond">
          <div>
            <el-input v-model.number="liquidationForm.bond"
                      size="small"
                      style="width: 130px"
                      v-if="mySar"
                      :disabled="parseFloat(mySar.mortgageRate)<=100"
                      @change="handleBondChange"></el-input>
            <i class="el-icon-caret-right"></i>
          </div>
          <div class="form-value">
            {{$t('individual.liquidateModal.value')}}：${{liquidationForm.bondV}}
          </div>
        </el-form-item>
        <el-form-item :label="$t('individual.liquidateModal.sneoAmount')" class="fl">
          <el-input v-model.number="liquidationForm.sneo"
                    disabled
                    size="small"
                    style="width: 130px"></el-input>
          <div class="form-value">
            {{$t('individual.liquidateModal.value')}}:${{liquidationForm.sneoV}}
          </div>
        </el-form-item>
      </el-form>
      <div>
        <div class="liquidated-info mt-30 clearfix">
          <span class="fl">{{$t('individual.liquidateModal.afterLiq')}}</span>
          <span class="fr">{{liquidationForm.rate | decimalPlaces(2)}}%</span>
        </div>
        <div class="liquidated-info mt-20 clearfix">
          <span class="fl">{{$t('individual.liquidateModal.afterStatus')}}</span>
          <span :class="['fr',{'green':liquidationForm.status==='0',
                               'blue':liquidationForm.status==='1',
                               'yellow':liquidationForm.status==='2',
                               'red':liquidationForm.status==='3'}]">
            {{liquidationForm.status | filterMethod($t('sarCStatus'))}}
          </span>
        </div>
      </div>
      <el-checkbox class="mt-30" v-model="gasFee">{{$t('global.feeInfo')}}</el-checkbox>
      <div slot="footer">
        <el-button class="sar-modal-btn" @click="beforeLiquidationClose">
          {{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn" type="primary" @click="liquidateSar">
          {{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--偿还bond模态框-->
    <el-dialog class="sar-modal"
               :title="$t('individual.myBond.payBack')"
               label-position="top"
               center
               :show-close="false"
               :lock-scroll="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="payBackModal.show">
      <el-form>
        <el-form-item label="SDUSD">
          <el-input-number v-model.number="payBackModal.amount"
                           controls-position="right"
                           :min="0"
                           :max="payBackModal.max"
                           style="width: 100%"></el-input-number>
        </el-form-item>
        <el-slider v-model="payBackModal.amount"
                   :step="0.00000001"
                   :min="0"
                   :max="payBackModal.max"></el-slider>
      </el-form>
      <el-checkbox class="mt-30" v-model="gasFee">{{$t('global.feeInfo')}}</el-checkbox>
      <div slot="footer">
        <el-button class="sar-modal-btn"
                   @click="payBackModal.show = false">{{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn"
                   type="primary"
                   :disabled="payBackModal.amount<=0"
                   @click="payBackBond">{{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--硬件钱包签名提示-->
    <cold-wallet-dialog :cold-wallet-dialog-visible="coldWalletDialogVisible"></cold-wallet-dialog>
  </el-card>
</template>

<script>
  import {sendDrawTransaction, getUtxo} from '~/api/global'
  import sarAddr from '~/mixins/getSarAddr'
  import checkTxid from '~/mixins/checkTxid'
  import historyDetail from '../public/historyDetail'
  import {getSarCHistory, getsar4CDetailByAdd} from '~/api/individual'
  import {filter, find} from 'lodash'
  import getLeaderPubkey from '~/mixins/getLeaderPubkey'
  import {mapGetters} from 'vuex'
  import {setDp, BN} from '~/utils/core'
  import {EIGHT_POWER, LOADING_OPTION} from "~/filters/const";
  import {filterMethod, filterTime, decimalPlaces} from '~/filters/core'
  import sarC from '~/mixins/sarC'

  export default {
    name: 'MyBond',
    props: {
      currentUser: {},
      assets: {
        type: Array,
        required: true,
      }
    },
    data() {
      return {
        mySar: null,
        historyModal: false,
        historyList: null,
        liquidationModal: false,
        liquidationForm: {
          bond: '',
          sneo: '',
          bondV: '',
          sneoV: '',
          rate: '',
          status: '0'
        },
        rules: {
          bond: [
            {
              required: true, validator: this.validatorBond, trigger: 'blur'
            }
          ],
        },
        payBackModal: {
          show: false,
          amount: 0,
          max: 0,
        },
        btnLocked: false,
        gasFee: false,
      }
    },
    computed: {
      ...mapGetters(['typeB', 'typeA']),
      lineRateC() {
        if (this.typeA) {
          return find(this.typeA, o => o.key === 'liquidate_line_rate_c').value;
        }
      }
    },
    mixins: [sarAddr, checkTxid, getLeaderPubkey, sarC],
    components: {
      historyDetail
    },
    async mounted() {
      if (!this.typeB) {
        await this.$store.dispatch('getTypeB');
      }
      if (!this.typeA) {
        await this.$store.dispatch('getTypeA');
      }
      this.getSarCInfo();
    },
    methods: {
      setDp,
      //获取我的sar信息
      async getSarCInfo() {
        let _mySar = await getsar4CDetailByAdd([this.currentUser.address, this.sarAddr.sarC.hash]);
        let mySar = _mySar.result;
        if (!mySar) {
          this.mySar = null;
          return;
        }

        mySar = mySar[0];
        let status = this.getSarCStatus(mySar.locked, mySar.hasDrawed, mySar.mortgageRate, this.lineRateC);
        mySar.status = status;
        this.mySar = mySar;
      },

      //清算
      opLiquidationModal() {
        this.liquidationModal = true;
        this.liquidationForm.bond = this.getBondMax();
        this.getLiquidationFormVal();
      },
      getLiquidationFormVal() {
        let sneo_price = find(this.typeB, o => o.key === 'sneo_price').value;
        let {locked, hasDrawed, mortgageRate} = this.mySar;

        //bond数量
        let bondAmount = Number(this.liquidationForm.bond);

        //sneo数量
        let sneoAmount = 0;
        if (mortgageRate > 100) {
          sneoAmount = new BN(this.liquidationForm.bond)
            .div(sneo_price).dp(8, 3).toNumber();
        } else {
          sneoAmount = Number(locked);
        }
        this.liquidationForm.sneo = sneoAmount;

        //sneo和bond价值
        let bondValue = new BN(bondAmount).dp(2, 3).toString();
        let sneoValue = new BN(this.liquidationForm.sneo).times(sneo_price).dp(2, 3).toString();
        this.liquidationForm.bondV = bondValue;
        this.liquidationForm.sneoV = sneoValue;

        //可清算Neo(增加判断)
        let canClearNeo;
        canClearNeo = Number(this.liquidationForm.sneo);

        if (canClearNeo > locked) {
          canClearNeo = locked;
        }

        //抵押率和状态
        let calcHasDrawed = new BN(hasDrawed).minus(bondAmount);
        let calcLocked = new BN(locked).minus(canClearNeo);
        let {rate, status} = this.getRateAndStatus(calcLocked, calcHasDrawed, sneo_price, this.lineRateC);
        this.liquidationForm.rate = rate;
        this.liquidationForm.status = status;
      },
      validatorBond(rule, value, callback) {
        let max = Number(this.getBondMax());
        let locale = this.$i18n.locale;
        let decimals = new BN(+value).dp();
        if (!value) {
          return callback(new Error(locale === 'en' ? 'BOND quantity cannot be empty.' : 'BOND值不能为空'));
        } else if (!Number(value)) {
          return callback(new Error(locale === 'en' ? 'BOND value must be numeric.' : 'BOND值必须为数字'))
        } else if (Number(value) > max) {
          return callback(new Error(locale === 'en' ? `The maximum BOND that can be input is ${max}` : `可投入的BOND最大值为${max}`));
        } else if (decimals > 8) {
          return callback(new Error(locale === 'en' ? `The number of decimal places cannot exceed 8 digits` : `小数位数不能超过8位`));
        } else {
          return callback();
        }
      },
      getBondMax() {
        let sneo_price = find(this.typeB, o => o.key === 'sneo_price').value;
        let lineTopRateC = find(this.typeA, o => o.key === 'liquidate_top_rate_c').value;
        let {locked, hasDrawed, mortgageRate} = this.mySar;

        //分子
        let molecule = new BN(lineTopRateC).div(100).minus(1).toNumber();

        //分母
        let denominator = new BN(
          new BN(lineTopRateC).div(100).times(hasDrawed)
        ).minus(
          new BN(locked).times(sneo_price)
        ).toNumber();

        //计算结果 0.0001此处为安全代码
        let result = new BN(denominator).div(molecule).minus(0.0001).dp(8, 3).toNumber();

        //比较
        mortgageRate = parseFloat(mortgageRate);
        if (mortgageRate > 100) {
          return result > hasDrawed ? hasDrawed : result;
        } else {
          return hasDrawed;
        }
      },
      handleBondChange(val) {
        if (Number(val)) {
          let max = this.getBondMax();
          this.liquidationForm.bond = this.liquidationForm.bond > max ? max : this.liquidationForm.bond;
          this.getLiquidationFormVal();
        }
      },
      beforeLiquidationClose() {
        this.$refs['liquidationForm'].resetFields();
        this.liquidationModal = false;
        this.btnLocked = false;
      },
      liquidateSar() {
        this.$refs['liquidationForm'].validate((valid) => {
          if (valid) {
            this.launchLiquidateSar();
          } else {
            return false;
          }
        });
      },
      async launchLiquidateSar() {
        if (this.btnLocked) {
          return;
        }
        this.btnLocked = true;
        const loading = this.$loading(LOADING_OPTION);

        let {wif, address} = this.currentUser;
        let amount = new BN(this.liquidationForm.bond).times(EIGHT_POWER).integerValue().toNumber();

        let scAddr = this.sarAddr.sarC.hash;
        let type = 'rescueT';
        let params = [
          "(addr)" + this.mySar.owner,
          "(addr)" + address,
          "(int)" + amount
        ];

        let utxo = await getUtxo([address]);
        let payfee = this.gasFee ? '0.001' : false;

        //签名
        let tempObj = {
          wif,
          scAddr,
          utxos: utxo.result ? utxo.result : null,
          type,
          params,
        };
        let r = await this.getSignature("callc", tempObj, payfee, loading);
        if (!r) {
          loading.close();
          this.btnLocked = false;
          return;
        }

        sendDrawTransaction([r.rawData]).then(draw => {
          this.checkTxid(r, draw, () => {
            this.liquidationModal = false;
            this.btnLocked = false;
            loading.close();
            this.updateViewData();
          });
        }).catch(() => {
          this.liquidationModal = false;
          this.btnLocked = false;
          loading.close();
        });
      },

      //更新数据
      updateViewData() {
        this.$emit('update-data');
      },

      //偿还bond
      opPayBackSarModal() {
        this.payBackModal.show = true;
        let bondDrawed = this.mySar.bondDrawed;
        bondDrawed = +bondDrawed;

        let max;
        let sdusdVal = find(this.assets, o => o.assetid === this.sarAddr.sdusd.hash);
        let balance = sdusdVal ? sdusdVal.balance : 0;
        balance = +balance;

        if (balance > bondDrawed) {
          max = bondDrawed;
        } else {
          max = balance;
        }
        this.payBackModal.amount = max;
        this.payBackModal.max = max;
      },
      async payBackBond() {
        if (this.btnLocked) {
          return;
        }
        this.btnLocked = true;
        const loading = this.$loading(LOADING_OPTION);

        let {wif, address} = this.currentUser;
        let amount = new BN(this.payBackModal.amount).times(EIGHT_POWER).integerValue().toNumber();

        let scAddr = this.sarAddr.sarC.hash;
        let type = 'withdrawT';
        let params = [
          "(addr)" + address,
          "(int)" + amount
        ];

        let utxo = await getUtxo([address]);
        let payfee = this.gasFee ? '0.001' : false;

        //签名
        let tempObj = {
          wif,
          scAddr,
          utxos: utxo.result ? utxo.result : 0,
          type,
          params
        };
        let r = await this.getSignature("callc", tempObj, payfee, loading);
        if (!r) {
          loading.close();
          this.btnLocked = false;
          return;
        }

        sendDrawTransaction([r.rawData]).then(draw => {
          this.checkTxid(r, draw, () => {
            this.payBackModal.show = false;
            this.btnLocked = false;
            this.updateViewData();
            loading.close();
          });
        }).catch(() => {
          this.payBackModal.show = false;
          this.btnLocked = false;
        });
      },

      //历史记录
      async getHistoryDetail() {
        let params = [this.mySar.txid, 100, 1];
        let historyList = await getSarCHistory(params);
        this.historyList = historyList.result;
        if (historyList) {
          this.historyList = filter(this.historyList, o => Number(o.type) === 9 || Number(o.type) === 10);
        } else {
          this.historyList = [];
        }
        this.historyModal = true;
      },
    },
    filters: {
      filterTime,
      filterMethod,
      decimalPlaces,
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/var";

  .bond {
    height: 200px;

    &-top {
      border-bottom: 1px solid $--border-color-base;
      height: 110px;

      .bond-item {
        float: left;
        height: 109px;
        width: 50%;
        border-right: 1px solid $--border-color-base;
        padding-left: 20px;

        &:last-child {
          border-right: 0;
        }

        &__val {
          margin-top: 36px;
          font-size: 18px;
          font-weight: bold;
        }

        &__title {
          font-size: 12px;
          color: #667;
          margin-top: 6px;
          font-family: PingFangSC-Regular;
        }
      }
    }

    &-bottom {
      padding: 29px 0;
      text-align: center;

      .bond-btn {
        width: 92px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        padding: 0;
        margin-left: 27px;

        &:first-child {
          margin-left: 0;
        }
      }
    }
  }

  .sar-modal {
    .el-icon-caret-right {
      display: inline-block;
      width: 16px;
      margin: 0 17px;
    }

    //after liquidated info
    .liquidated-info {
      color: #667;
      line-height: 30px;
      border-bottom: 1px solid $--border-color-base;
    }

    //liquidation form bond and sneo value
    .form-value {
      color: #9999AA;
      width: 130px;
      overflow-x: hidden;
    }
  }
</style>

