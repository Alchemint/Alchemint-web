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
                   @click="opLiquidationModal">
          {{$t('individual.myBond.liquidate')}}
        </el-button>
        <el-button type="primary"
                   plain
                   class="bond-btn"
                   :disabled="!mySar.bondDrawed"
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

    <!--history dialog-->
    <el-dialog class="sar-modal"
               :title="$t('individual.myBond.historyTitle')"
               width="1000px"
               label-position="top"
               center
               :show-close="true"
               stripe
               :visible.sync="historyModal">
      <history-detail v-if="historyList" :data="historyList" type="sarC"></history-detail>
    </el-dialog>

    <!--liquidation dialog-->
    <el-dialog class="sar-modal"
               :title="$t('individual.liquidateModal.title')"
               label-position="top"
               center
               :show-close="true"
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
        <el-form-item :label="$t('individual.liquidateModal.bondAmount')" class="fl" prop="BOND">
          <div>
            <el-input v-model.number="liquidationForm.BOND"
                      size="small"
                      style="width: 130px"
                      v-if="mySar"
                      :disabled="mySar.ratioAvail<=1"
                      @change="handleBondChange"></el-input>
            <i class="el-icon-caret-right"></i>
          </div>
          <div class="form-value">
            {{$t('individual.liquidateModal.value')}}：${{liquidationForm.BONDV}}
          </div>
        </el-form-item>
        <el-form-item :label="$t('individual.liquidateModal.sneoAmount')" class="fl">
          <el-input v-model.number="liquidationForm.SNEO"
                    disabled
                    size="small"
                    style="width: 130px"></el-input>
          <div class="form-value" v-if="sarConfig">
            {{$t('individual.liquidateModal.value')}}:${{liquidationForm.SNEOV}}
          </div>
        </el-form-item>
      </el-form>
      <div>
        <div class="liquidated-info mt-30 clearfix">
          <span class="fl">{{$t('individual.liquidateModal.afterLiq')}}</span>
          <span class="fr">{{liquidationForm.rateShow}}</span>
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
      <div slot="footer">
        <el-button class="sar-modal-btn" @click="beforeLiquidationClose">
          {{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn" type="primary" @click="liquidateSar">
          {{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--pay back bond dialog-->
    <el-dialog class="sar-modal"
               :title="$t('individual.myBond.payBack')"
               label-position="top"
               center
               :show-close="false"
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
        liquidationModal: false,
        liquidationForm: {
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
        payBackModal: {
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
      //liquidate sar
      opLiquidationModal() {
        this.liquidationModal = true;
        this.liquidationForm.BOND = this.getBondMax();
        this.getLiquidationFormVal();
      },
      getLiquidationFormVal() {
        let {sneo_price, liquidate_line_rate_c} = this.sarConfig;
        let {sarLocked, sarHasDrawed, ratioAvail} = this.mySar;
        let canClearNeo;

        //bond amount
        let mount = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(this.liquidationForm.BOND))
              .multiply(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 0
        );
        mount = +mount;

        //sneo amount
        if (+ratioAvail > 1) {
          this.liquidationForm.SNEO = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(this.liquidationForm.BOND))
                .multiply(bigmath.bignumber(bigmath.pow(10, 8)))
                .divide(bigmath.bignumber(sneo_price))
                .done()
            )
          );
        } else {
          this.liquidationForm.SNEO = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(sarLocked))
                .divide(bigmath.bignumber(bigmath.pow(10, 8)))
                .done()
            )
          )
        }

        //sneo and bond value
        this.liquidationForm.BONDV = formatPrecision(this.liquidationForm.BOND, 2);
        this.liquidationForm.SNEOV = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(this.liquidationForm.SNEO))
              .multiply(bigmath.bignumber(sneo_price))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 2
        );

        //can clear neo
        canClearNeo = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(this.liquidationForm.SNEO))
              .multiply(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          )
        );
        canClearNeo = +canClearNeo;


        if (canClearNeo > sarLocked) {
          canClearNeo = sarLocked;
        }

        //rate
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
        this.liquidationForm.rate = rate;
        this.liquidationForm.rateShow = rateShow;

        //liquidated status
        let status;
        if (rate >= (liquidate_line_rate_c + 50)) {
          status = '1';
        }
        if (rate >= liquidate_line_rate_c && rate < (liquidate_line_rate_c + 50)) {
          status = '2';
        }
        if (rate < liquidate_line_rate_c) {
          status = '3';
        }

        if (sarLocked === 0 || sarHasDrawed === 0 || rate === 0) {
          status = '0';
        }
        this.liquidationForm.status = status;
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
        let {sarLocked, sarHasDrawed, ratioAvail} = this.mySar;

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
              .subtract(bigmath.bignumber(0.001))
              .done()
          )
        );
        result = +result;

        //sarHasDrawed
        let mount = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(sarHasDrawed))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          )
        );

        mount = +mount;

        if (+ratioAvail > 1) {
          return result > mount ? mount : result;
        } else {
          return mount;
        }
      },
      handleBondChange(val) {
        if (Number(val)) {
          let max = this.getBondMax();
          this.liquidationForm.BOND = this.liquidationForm.BOND > max ? max : this.liquidationForm.BOND;
          this.getLiquidationFormVal();
        }
      },
      beforeLiquidationClose() {
        this.$refs['liquidationForm'].resetFields();
        this.liquidationModal = false;
      },
      liquidateSar() {
        this.$refs['liquidationForm'].validate((valid) => {
          if (valid) {
            if (this.disabled) {
              return;
            }
            this.disabled = true;
            this.launchLiquidateSar();
          } else {
            return false;
          }
        });
      },
      async launchLiquidateSar() {
        const loading = this.$loading({
          lock: true,
          text: '',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        let {wif, address} = this.currentUser;
        let amount = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(this.liquidationForm.BOND))
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
            this.liquidationModal = false;
            loading.close();
            location.reload();
          });
        }).catch(() => {
          this.liquidationModal = false;
          this.disabled = false;
        });

      },

      //pay back bond
      opPayBackSarModal() {
        this.payBackModal.show = true;
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
        this.payBackModal.amount = max;
        this.payBackModal.max = max;
      },
      async payBackBond() {
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
            bigmath.chain(bigmath.bignumber(this.payBackModal.amount))
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
            this.payBackModal.show = false;
            loading.close();
            location.reload();
          });
        }).catch(() => {
          this.payBackModal.show = false;
          this.disabled = false;
        });
      },

      //get bond history detail
      async getHistoryDetail() {
        let params = [this.mySar.sarTxid, 100, 1];
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

