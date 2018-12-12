<template>
  <el-card class="border-card content-no-padding">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">{{$t('individual.myBond.title')}}</span>
    </div>
    <div class="bond">
      <div class="bond-top clearfix">
        <div class="bond-item">
          <div class="bond-item__val" v-if="mySar">{{mySar.bondDrawedShow | numFormat}}</div>
          <div class="bond-item__val" v-else>--</div>
          <div class="bond-item__title">{{$t('individual.myBond.bondUsed')}}</div>
        </div>
        <div class="bond-item">
          <div class="bond-item__val" v-if="mySar">{{mySar.bondLockedShow | numFormat}}</div>
          <div class="bond-item__val" v-else>--</div>
          <div class="bond-item__title">{{$t('individual.myBond.sneoLocked')}}</div>
        </div>
      </div>
      <div class="bond-bottom" v-if="mySar">
        <el-button type="primary"
                   plain
                   class="bond-btn"
                   :disabled="mySar.status!=='3'"
                   @click="opSettleSar">
          {{$t('individual.myBond.liquidate')}}
        </el-button>
        <el-button type="primary"
                   plain
                   class="bond-btn"
                   :disabled="!mySar.bondDrawed"
                   @click="opWithDrawModal">
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

    <!--history dialog-->
    <el-dialog class="sar-modal history-modal"
               :title="$t('individual.myBond.historyTitle')"
               width="1000px"
               label-position="top"
               center
               :show-close="true"
               stripe
               :visible.sync="historyModal">
      <history-detail v-if="historyList" :data="historyList" type="sarC"></history-detail>
    </el-dialog>

    <!--liquidate dialog-->
    <el-dialog class="sar-modal settle-modal"
               :title="$t('individual.liquidateModal.title')"
               width="360px"
               label-position="top"
               center
               :show-close="true"
               stripe
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :before-close="beforeSettleClose"
               :visible.sync="settleModal">
      <el-form ref="settleForm"
               label-position="top"
               :rules="rules"
               :model="settleForm"
               class="settle-form clearfix">
        <el-form-item :label="$t('individual.liquidateModal.bondAmount')" class="fl" prop="BOND">
          <div>
            <el-input v-model.number="settleForm.BOND"
                      size="small"
                      style="width: 130px"
                      v-if="mySar"
                      :disabled="mySar.ratioAvail<=1"
                      @change="handleBondChange"></el-input>
            <i class="el-icon-caret-right"></i>
          </div>
          <div class="form-tip">
            {{$t('individual.liquidateModal.value')}}：${{settleForm.BONDV}}
          </div>
        </el-form-item>
        <el-form-item :label="$t('individual.liquidateModal.sneoAmount')" class="fl">
          <el-input v-model.number="settleForm.SNEO"
                    disabled
                    size="small"
                    style="width: 130px"></el-input>
          <div class="form-tip" v-if="sarConfig">
            {{$t('individual.liquidateModal.value')}}:${{settleForm.SNEOV}}
          </div>
        </el-form-item>
      </el-form>
      <div>
        <div class="resuce-info mt-30 clearfix">
          <span class="fl">{{$t('individual.liquidateModal.afterLiq')}}</span>
          <span class="fr">{{settleForm.rateShow}}</span>
        </div>
        <div class="resuce-info mt-20 clearfix">
          <span class="fl">{{$t('individual.liquidateModal.afterStatus')}}</span>
          <span :class="['fr',{'green':settleForm.status==='0',
                               'blue':settleForm.status==='1',
                               'yellow':settleForm.status==='2',
                               'red':settleForm.status==='3'}]">
            {{settleForm.status | filterMethod($t('sarCStatus'))}}
          </span>
        </div>
      </div>
      <div slot="footer">
        <el-button class="sar-modal-btn" @click="beforeSettleClose">
          {{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn" type="primary" @click="settleSar">
          {{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--payback bond dialog-->
    <el-dialog class="sar-modal"
               :title="$t('individual.myBond.payBack')"
               label-position="top"
               center
               :show-close="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="withDrawModal.show">
      <el-form>
        <el-form-item label="SDUSD">
          <el-input-number v-model.number="withDrawModal.amount"
                           controls-position="right"
                           :min="0"
                           :max="withDrawModal.max"
                           style="width: 100%"></el-input-number>
        </el-form-item>
        <el-slider v-model="withDrawModal.amount"
                   :step="0.00000001"
                   :min="0"
                   :max="withDrawModal.max"></el-slider>
      </el-form>
      <div slot="footer">
        <el-button class="sar-modal-btn"
                   @click="withDrawModal.show = false">{{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn"
                   type="primary"
                   :disabled="withDrawModal.amount<=0"
                   @click="withDrawBond">{{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  import {filterMethod, filterTime, numFormat} from '../../filters/index'
  import {bigmath, formatPrecision, printNumber} from '../../utils'
  import {sendDrawTransaction} from '../../api/global'
  import sarAddr from '../../mixins/getSarAddr'
  import checkTxid from '../../mixins/checkTxid'
  import historyDetail from '../public/historyDetail'
  import {getSarCHistory} from '../../api/individual'
  import {filter, find} from 'lodash'

  export default {
    name: 'MyBond',
    props: {
      currentUser: {
        type: Object,
        required: true,
      },
      sarConfig: {
        type: Object,
        required: true,
      },
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
        settleModal: false,
        settleForm: {
          BOND: '',
          SNEO: '',
          BONDV: '',
          SNEOV: '',
          rate: '',
          status: '0'
        },
        rules: {
          BOND: [
            {
              required: true, validator: this.validatorBond, trigger: 'blur'
            }
          ],
        },
        withDrawModal: {
          show: false,
          amount: 0,
          max: 0,
        },
        disabled: false,
      }
    },
    mixins: [sarAddr, checkTxid],
    components: {
      historyDetail
    },
    async mounted() {
      let mySar = await this.$parent.getSarInfo(this.sarConfig, this.currentUser.address);
      if (mySar) {
        this.mySar = mySar;
      }
    },
    methods: {
      opSettleSar() {
        this.settleModal = true;
        this.settleForm.BOND = this.getBondMax();
        this.getSettleFormVal();
      },
      getSettleFormVal() {
        let {sneo_price, liquidate_line_rate_c} = this.sarConfig;
        let {sarLocked, sarHasDrawed} = this.mySar;
        let canClearNeo;

        // bond amount
        let mount = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(this.settleForm.BOND))
              .multiply(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 0
        );
        mount = +mount;

        // calculate sneo amount
        this.settleForm.SNEO = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(this.settleForm.BOND))
              .multiply(bigmath.bignumber(bigmath.pow(10, 8)))
              .divide(bigmath.bignumber(sneo_price))
              .done()
          )
        );

        // calculate sneo and sdusd value
        this.settleForm.BONDV = formatPrecision(this.settleForm.BOND, 2);
        this.settleForm.SNEOV = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(this.settleForm.SNEO))
              .multiply(bigmath.bignumber(sneo_price))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 2
        );

        // can clear neo
        canClearNeo = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(this.settleForm.SNEO))
              .multiply(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          )
        );
        canClearNeo = +canClearNeo;


        if (canClearNeo > sarLocked) {
          canClearNeo = sarLocked;
        }

        // current rate
        let rate, rateShow;
        if (Number(sarHasDrawed) === Number(mount)) {
          rate = 0;
          rateShow = '--';
        } else {
          rate = formatPrecision(
            printNumber(
              bigmath.chain(
                bigmath.bignumber(
                  bigmath.chain(bigmath.bignumber(sarLocked))
                    .subtract(bigmath.bignumber(canClearNeo))
                    .multiply(bigmath.bignumber(sneo_price))
                    .done()
                )
              ).divide(
                bigmath.bignumber(
                  bigmath.chain(bigmath.bignumber(sarHasDrawed))
                    .subtract(bigmath.bignumber(mount))
                    .done()
                )
              ).divide(
                bigmath.bignumber(bigmath.pow(10, 8))
              ).multiply(bigmath.bignumber(100))
                .done()
            )
          );
          rateShow = formatPrecision(rate, 2) + '%';
        }
        rate = +rate;
        this.settleForm.rate = rate;
        this.settleForm.rateShow = rateShow;

        // liquidated status
        let status;
        if (rate > (liquidate_line_rate_c + 50)) {
          status = '1';
        }
        if (rate >= liquidate_line_rate_c && rate <= (liquidate_line_rate_c + 50)) {
          status = '2';
        }
        if (rate < liquidate_line_rate_c) {
          status = '3';
        }

        if (sarLocked === 0 || sarHasDrawed === 0 || rate === 0) {
          status = '0';
        }
        this.settleForm.status = status;
      },
      validatorBond(rule, value, callback) {
        let max = Number(this.getBondMax());
        let locale = this.$i18n.locale;
        if (!value) {
          return callback(new Error(locale === 'en' ? 'BOND quantity cannot be empty.' : 'BOND值不能为空'));
        } else if (!Number(value)) {
          return callback(new Error(locale === 'en' ? 'BOND value must be numeric.' : 'BOND值必须为数字'))
        } else if (Number(value) > max) {
          return callback(new Error(locale === 'en' ? `The maximum BOND that can be input is ${max}` : `可投入的BOND最大值为${max}`));
        } else {
          return callback();
        }
      },
      getBondMax() {
        let {sneo_price, liquidate_top_rate_c} = this.sarConfig;
        let {sarLocked, sarHasDrawed} = this.mySar;

        let molecule = bigmath.chain(bigmath.bignumber(liquidate_top_rate_c))
          .divide(bigmath.bignumber(100))
          .subtract(bigmath.bignumber(1))
          .done();

        let denominator = bigmath.chain(
          bigmath.bignumber(
            bigmath.chain(bigmath.bignumber(liquidate_top_rate_c))
              .divide(bigmath.bignumber(100))
              .multiply(bigmath.bignumber(sarHasDrawed))
              .done()
          )
        ).subtract(
          bigmath.bignumber(
            bigmath.chain(bigmath.bignumber(sneo_price))
              .multiply(bigmath.bignumber(sarLocked))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          )
        ).done();

        let result = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(denominator))
              .divide(bigmath.bignumber(molecule))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .subtract(bigmath.bignumber(0.1))
              .done()
          )
        );
        result = +result;

        let mount = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sarHasDrawed))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          )
        );

        mount = +mount;

        return result > mount ? mount : result;
      },
      handleBondChange(val) {
        if (Number(val)) {
          let max = this.getBondMax();
          this.settleForm.BOND = this.settleForm.BOND > max ? max : this.settleForm.BOND;
          this.getSettleFormVal();
        }
      },
      beforeSettleClose() {
        this.$refs['settleForm'].resetFields();
        this.settleModal = false;
      },
      settleSar() {
        this.$refs['settleForm'].validate((valid) => {
          if (valid) {
            if (this.disabled) {
              return;
            }
            this.disabled = true;
            this.getSettleSar();
          } else {
            return false;
          }
        });
      },
      async getSettleSar() {
        const loading = this.$loading({
          lock: true,
          text: '',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        let {wif, address} = this.currentUser;
        let amount = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(this.settleForm.BOND))
              .multiply(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 0
        );

        let scAddr = this.sarAddr.sarC.hash;
        let type = 'rescueT';
        let params = [
          "(addr)" + this.mySar.addr,
          "(addr)" + address,
          "(int)" + amount
        ];

        let r = await eNeo.callC(wif, scAddr, type, params);

        sendDrawTransaction([r.rawData]).then(draw => {
          this.checkTxid(r, draw, () => {
            this.settleModal = false;
            loading.close();
            location.reload();
          });
        }).catch(() => {
          this.settleModal = false;
          this.disabled = false;
        });

      },
      opWithDrawModal() {
        this.withDrawModal.show = true;
        let bondDrawed = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(this.mySar.bondDrawed))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          )
        );
        bondDrawed = +bondDrawed;

        let max;
        let sdusdVal = find(this.assets, o => o.symbol === 'SDUSD');
        let balance = sdusdVal ? sdusdVal.balance : 0;
        balance = +balance;

        if (balance > bondDrawed) {
          max = bondDrawed;
        } else {
          max = balance;
        }
        this.withDrawModal.amount = max;
        this.withDrawModal.max = max;
      },
      async withDrawBond() {
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
        let amount = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(this.withDrawModal.amount))
              .multiply(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 0
        );

        let scAddr = this.sarAddr.sarC.hash;
        let type = 'withdrawT';
        let params = [
          "(addr)" + address,
          "(int)" + amount
        ];

        let r = await eNeo.callC(wif, scAddr, type, params);

        sendDrawTransaction([r.rawData]).then(draw => {
          this.checkTxid(r, draw, () => {
            this.withDrawModal.show = false;
            loading.close();
            location.reload();
          });
        }).catch(() => {
          this.withDrawModal.show = false;
          this.disabled = false;
        });
      },

      //sar history detail
      async getHistoryDetail() {
        let params = [this.mySar.sarTxid, 10000, 1];
        let historyList = await getSarCHistory(params);
        this.historyList = historyList.result;
        if (historyList) {
          this.historyList = filter(this.historyList,
            o => Number(o.type) === 9 || Number(o.type) === 10);
        } else {
          this.historyList = [];
        }
        this.historyModal = true;
      },
    },
    filters: {
      filterTime,
      filterMethod,
      numFormat
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
    }
    &-item {
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

  .el-icon-caret-right {
    display: inline-block;
    width: 16px;
    margin: 0 17px;
  }

  .resuce-info {
    color: #667;
    line-height: 30px;
    border-bottom: 1px solid $--border-color-base;
  }

  .form-tip {
    color: #9999AA;
    width: 130px;
    overflow-x: hidden;
  }
</style>

