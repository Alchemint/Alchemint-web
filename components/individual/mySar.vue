<template>
  <el-card class="border-card content-no-padding">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">{{$t('individual.mySar.title')}}</span>
    </div>
    <!--create sar-->
    <div class="align-center" v-if="!mySar">
      <el-button class="create-btn"
                 type="primary"
                 :disabled="createBtn"
                 @click="createSar">{{$t('individual.mySar.createSar')}}
      </el-button>
    </div>

    <!--my sar info-->
    <div v-else class="sar-detail clearfix">
      <div class="sar-detail-info">
        <div class="sar-detail-item">
          <div class="sar-detail-item__val">{{mySar.sarTxid | filterTxid}}</div>
          <div class="sar-detail-item__title">TXID</div>
        </div>
        <div class="sar-detail-item">
          <div class="sar-detail-item__val">{{mySar.wenCanDrawShow | numFormat}}</div>
          <div class="sar-detail-item__title">{{$t('individual.mySar.sdusdRemained')}}</div>
        </div>
        <div class="sar-detail-item">
          <div class="sar-detail-item__val">{{mySar.availSdsCanfreeShow | numFormat}}</div>
          <div class="sar-detail-item__title">{{$t('individual.mySar.sneoDrawable')}}</div>
        </div>
        <div class="sar-detail-item">
          <div :class="['sar-detail-item__val',{
                'blue':mySar.status==='1',
                'yellow':mySar.status==='2',
                'red':mySar.status==='3',
                }]">{{mySar.ratioAvailShow | numFormat}}
          </div>
          <div class="sar-detail-item__title">{{$t('individual.mySar.sarRate')}}</div>
        </div>
        <div class="sar-detail-item">
          <div class="sar-detail-item__val">{{mySar.sdsFeeShow | numFormat}}</div>
          <div class="sar-detail-item__title">{{$t('individual.mySar.feeBalance')}}</div>
        </div>
        <div class="sar-detail-item no-border-bottom">
          <div :class="['sar-detail-item__val',{
                'blue':mySar.status==='1',
                'yellow':mySar.status==='2',
                'red':mySar.status==='3',
                }]">
            {{mySar.status | filterMethod($t('sarCStatus'))}}
          </div>
          <div class="sar-detail-item__title">{{$t('individual.mySar.status')}}
            <status-tooltip :sar-config="sarConfig"></status-tooltip>
          </div>
        </div>
        <div class="sar-detail-item no-border-bottom">
          <div class="sar-detail-item__val">{{mySar.sarHasDrawedShow | numFormat}}</div>
          <div class="sar-detail-item__title">{{$t('individual.mySar.sdusdIssued')}}</div>
        </div>
        <div class="sar-detail-item no-border-bottom">
          <div class="sar-detail-item__val">{{mySar.sarLockedShow | numFormat}}</div>
          <div class="sar-detail-item__title">{{$t('individual.mySar.sneoCollateralized')}}</div>
        </div>
        <div class="sar-detail-item no-border-bottom">
          <div class="sar-detail-item__val">{{mySar.liquidationPriceShow | numFormat}}</div>
          <div class="sar-detail-item__title">{{$t('individual.mySar.liquidationPrice')}}</div>
        </div>
        <div class="sar-detail-item no-border-bottom">
          <div class="sar-detail-item__val">{{needFee | numFormat}}</div>
          <div class="sar-detail-item__title">{{$t('individual.mySar.feeGenerated')}}</div>
        </div>
      </div>
      <div class="sar-detail-controls">
        <div style="margin-top: 29px">
          <el-button type="primary"
                     plain
                     :disabled="reserveBtn"
                     @click="opOperationModal('reserve')">
            {{$t('individual.mySar.increase')}}
          </el-button>
          <el-button type="primary"
                     plain
                     :disabled="withdrawBtn"
                     @click="opOperationModal('withdraw')">
            {{$t('individual.mySar.draw')}}
          </el-button>
        </div>
        <div class="mt-10" style="position: relative">
          <el-button type="primary"
                     plain
                     :disabled="expandeBtn"
                     @click="opOperationModal('expande')">
            {{$t('individual.mySar.issue')}}
          </el-button>
          <el-button type="primary"
                     plain
                     :disabled="contractBtn"
                     @click="opOperationModal('contract')">
            {{$t('individual.mySar.return')}}
          </el-button>
          <el-tooltip popper-class="global-popper"
                      placement="bottom-end"
                      effect="light">
            <div slot="content" style="width: 280px">
              {{$t('individual.mySar.rechargeInfo')}}
            </div>
            <icon-font name="icon-wenhao" class="green contract-info"></icon-font>
          </el-tooltip>
        </div>
        <div class="mt-10">
          <el-button type="primary"
                     plain
                     :disabled="rechargeBtn"
                     @click="opOperationModal('recharge')">
            {{$t('individual.mySar.recharge')}}
          </el-button>
          <el-button type="primary"
                     plain
                     :disabled="claimFeeBtn"
                     @click="opOperationModal('claimFee')">
            {{$t('individual.mySar.refund')}}
          </el-button>
        </div>
        <div class="mt-10">
          <el-button type="primary"
                     plain
                     @click="getHistoryDetail">{{$t('individual.mySar.history')}}
          </el-button>
          <el-button type="primary"
                     plain
                     :disabled="closeBtn"
                     @click="closeModal=true">{{$t('individual.mySar.closeSar')}}
          </el-button>
        </div>
      </div>
    </div>

    <!--operation sar dialog-->
    <el-dialog class="sar-modal"
               :title="operationModal.title"
               label-position="top"
               center
               :show-close="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="operationModal.show">
      <el-form @submit.native.prevent>
        <el-form-item :label="operationModal.name" props="num">
          <el-input-number v-model.number="operationModal.amount"
                           controls-position="right"
                           :min="0"
                           :max="operationModal.max"
                           @change="getAfterMortgageRate"
                           style="width: 100%"></el-input-number>
        </el-form-item>
        <el-slider v-model="operationModal.amount"
                   :step="0.00000001"
                   :min="0"
                   @change="getAfterMortgageRate"
                   :max="operationModal.max"></el-slider>
      </el-form>
      <div v-if="operationModal.type!=='recharge' && operationModal.type!=='claimFee'">
        <div class="liquidation-info mt-20 clearfix" v-if="operationModal.type==='contract'">
          <span class="fl">{{$t('individual.mySar.fee')}}</span>
          <span class="fr">{{operationModal.needFee}} SDS</span>
        </div>
        <div class="sds-fee-info" v-if="confirmBtn">{{$t('individual.mySar.insufficientFee')}}</div>
        <div class="liquidation-info mt-20 clearfix">
          <span class="fl">{{$t('individual.mySar.afterMortgageRate')}}</span>
          <span class="fr">{{operationModal.rateShow}}</span>
        </div>
        <div class="liquidation-info mt-20 clearfix">
          <span class="fl">{{$t('individual.mySar.afterStatus')}}
             <status-tooltip :sar-config="sarConfig"></status-tooltip>
          </span>
          <span :class="['fr',{'green':operationModal.status==='0',
                               'blue':operationModal.status==='1',
                               'yellow':operationModal.status==='2',
                               'red':operationModal.status==='3'}]">
            {{operationModal.status | filterMethod($t('sarCStatus'))}}
          </span>
        </div>
        <div class="warn-info"
             v-if="operationModal.rate < sarConfig.liquidate_line_rate_c + 50
               && operationModal.status!=='0'">
          <i class="el-icon-warning"></i>
          <span>&nbsp;
            {{$t('individual.mySar.liquidationRiskInfo',{
               topRate:sarConfig.liquidate_line_rate_c + 50
            })}}</span>
        </div>
      </div>
      <div slot="footer">
        <el-button class="sar-modal-btn"
                   @click="operationModal.show = false">{{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn"
                   type="primary"
                   :disabled="confirmBtn"
                   @click="opRiskModal">{{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--close sar dialog-->
    <el-dialog class="sar-modal"
               :title="$t('individual.mySar.closeSar')"
               label-position="top"
               center
               :show-close="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="closeModal">
      <div class="close-sar-info align-center">{{$t('individual.mySar.closeSarInfo')}}</div>
      <div class="align-center mt-40">{{$t('individual.mySar.closeSarSure')}}</div>
      <div slot="footer">
        <el-button class="sar-modal-btn"
                   @click="closeModal=false">{{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn" type="primary"
                   @click="closeSar">{{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--history dialog-->
    <el-dialog class="sar-modal no-header-modal"
               :title="$t('global.history.sarOperationHistory')"
               width="1000px"
               label-position="top"
               center
               :show-close="true"
               stripe
               :before-close="beforeHistoryClose"
               :visible.sync="historyModal">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('global.history.sarOperationHistory')" name="sar">
          <history-detail v-if="historyList"
                          :data="historyListShow"></history-detail>
        </el-tab-pane>
        <el-tab-pane :label="$t('global.history.liquidatioOperationHistory')" name="liquidation">
          <history-detail v-if="historyList"
                          :data="historyListShow"></history-detail>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!--risk warning dialog-->
    <el-dialog class="sar-modal risk-modal"
               :title="$t('individual.mySar.riskModal.title')"
               label-position="top"
               center
               :show-close="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="riskModal">
      <div class="risk-modal-content">
        <div class="risk-modal-content__title">
          {{$t('individual.mySar.riskModal.infoTitle',{
          topRate:sarConfig.liquidate_line_rate_c + 50
          })}}
        </div>
        <ul class="risk-modal-content__detail"
            v-html="$t('individual.mySar.riskModal.infoDetail',{
            lineRate:sarConfig.liquidate_line_rate_c
            })"></ul>
      </div>
      <div class="risk-modal-footer">
        <el-button type="primary"
                   plain
                   class="full-btn"
                   @click="riskModal=false">{{$t('individual.mySar.riskModal.cancelBtn')}}
        </el-button>
        <div class="mt-10">
          <el-button type="primary"
                     plain
                     class="full-btn"
                     @click="operationSar">{{$t('individual.mySar.riskModal.confirmBtn')}}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  import {filterMethod, filterTime, numFormat} from '../../filters'
  import sarAddr from '../../mixins/getSarAddr'
  import checkTxid from '../../mixins/checkTxid'
  import {sendDrawTransaction, getBlockCount} from "../../api/global";
  import {filter, find} from 'lodash'
  import {bigmath, formatPrecision, printNumber} from '../../utils'
  import {getSarCHistory} from '../../api/individual'
  import historyDetail from '../public/historyDetail'
  import statusTooltip from './statusTooltip'

  export default {
    name: 'MySar',
    props: {
      currentUser: {
        type: Object,
        required: true,
      },
      sarConfig: {
        type: Object,
        required: true,
      },
      assets: {},
    },
    data() {
      return {
        mySar: null,
        needFee: '',
        operationModal: {
          show: false,
          type: '',
          name: '',
          title: '',
          desc: '',
          amount: 0,
          max: 100,
          status: '0',
          rate: '',
          rateShow: '',
          needFee: '',
        },
        createBtn: true,
        reserveBtn: true,
        withdrawBtn: true,
        expandeBtn: true,
        contractBtn: true,
        rechargeBtn: true,
        claimFeeBtn: true,
        closeBtn: true,
        disabled: false,
        confirmBtn: false,
        closeModal: false,
        historyModal: false,
        historyList: null,
        historyListShow: null,
        activeTab: 'sar',
        riskModal: false,
      }
    },
    mixins: [sarAddr, checkTxid],
    components: {
      historyDetail,
      statusTooltip
    },
    async mounted() {
      let mySar = await this.$parent.getSarInfo(this.sarConfig, this.currentUser.address);
      this.createBtn = false;
      if (mySar) {
        this.mySar = mySar;
        this.$parent.hasMySar = true;

        //add sneo btn
        let sneoMax = find(this.assets, o => o.symbol === 'SNEO');
        if (sneoMax) {
          this.reserveBtn = Number(sneoMax.balance) <= 0 ? true : false;
        } else {
          this.reserveBtn = true;
        }
        //draw sneo btn
        this.withdrawBtn = Number(mySar.availSdsCanfree) <= 0 ? true : false;
        //issue sdusd btn
        this.expandeBtn = Number(mySar.wenCanDraw) <= 0 ? true : false;
        //return sdusd btn
        let tempObj = find(this.assets, o => o.symbol === 'SDUSD');
        let num = tempObj ? tempObj.balance : 0;
        let contractNum;
        if (mySar.sarHasDrawed > num) {
          contractNum = num
        } else {
          contractNum = mySar.sarHasDrawed;
        }
        if (Number(contractNum) > 0 && Number(mySar.sdsFee) > 0) {
          this.contractBtn = false;
        } else {
          this.contractBtn = true;
        }
        //add sds btn
        let sdsVal = find(this.assets, o => o.symbol === 'SDS');
        if (sdsVal) {
          this.rechargeBtn = Number(sdsVal.balance) <= 0 ? true : false;
        } else {
          this.rechargeBtn = true;
        }
        //draw sds btn
        this.claimFeeBtn = Number(mySar.sdsFee) <= 0 ? true : false;

        //close sar btn
        if (Number(mySar.sarHasDrawed) === 0
          && Number(mySar.sarLocked) === 0
          && Number(mySar.sdsFee) === 0
          && Number(mySar.fee) === 0
          && Number(mySar.bondDrawed) === 0) {
          this.closeBtn = false;
        } else {
          this.closeBtn = true;
        }

        //fee to be paid (sds)
        this.needFee = await this.getNeedSdsFee(mySar.sarHasDrawed);
      }
    },
    methods: {
      //create sar
      async createSar() {
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
        this.createBtn = true;
        let {wif, address} = this.currentUser;
        let scAddr = this.sarAddr.sarC.hash;
        let type = 'openSAR4C';
        let params = [
          "(addr)" + address,
          "(str)" + 'sneo_price'
        ];

        let r = await eNeo.callC(wif, scAddr, type, params);

        sendDrawTransaction([r.rawData]).then(draw => {
          this.checkTxid(r, draw, () => {
            loading.close();
            location.reload();
          });
        }).catch(() => {
          this.createBtn = false;
          this.disabled = false;
        });
      },

      //sar info
      async getCurrentBlockHeight() {
        let _currentHeight = await getBlockCount([]);
        let currentHeight = _currentHeight.result;
        let blockHeight;
        if (currentHeight) {
          blockHeight = currentHeight[0].blockcount;
        }
        return blockHeight;
      },
      async getNeedSdsFee(mount) {
        //currFee = (blockHeight - lastHeight) * hasDrawed * fee_rate / SIXTEEN_POWER;
        //SIXTEEN_POWER = 10^16
        let blockHeight = await this.getCurrentBlockHeight();
        blockHeight = +blockHeight;
        let currFee = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(blockHeight))
              .subtract(bigmath.bignumber(this.mySar.lastHeight))
              .multiply(bigmath.bignumber(this.mySar.sarHasDrawed))
              .multiply(bigmath.bignumber(this.sarConfig.fee_rate_c))
              .divide(bigmath.bignumber(bigmath.pow(10, 16)))
              .done()
          )
        );
        currFee = +currFee;

        //needUSDFee = (currFee + fee) * mount / hasDrawed;
        let needUSDFee;
        if (Number(mount === 0)) {
          needUSDFee = 0;
        } else {
          needUSDFee = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(currFee))
                .add(bigmath.bignumber(this.mySar.fee))
                .multiply(bigmath.bignumber(mount))
                .divide(bigmath.bignumber(this.mySar.sarHasDrawed))
                .done()
            )
          );
        }

        needUSDFee = +needUSDFee;

        //needFee = needUSDFee * EIGHT_POWER / sdsPrice;
        //EIGHT_POWER=10^8
        let needFee = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(needUSDFee))
              .divide(bigmath.bignumber(this.sarConfig.sds_price))
              .done()
          )
        );
        return needFee;
      },

      //operation sar
      opOperationModal(type) {
        this.operationModal.show = true;
        this.operationModal.type = type;

        let locale = this.$i18n.locale;

        let mySar = this.mySar;
        let opSarMax = 0;
        let amount = 0;

        //add sneo
        if (type === "reserve") {
          this.operationModal.title = locale === 'en' ? 'Add Collateral' : '增加抵押物';
          this.operationModal.desc = locale === 'en' ?
            'Input collateral amount to be increased' : '请输入增加抵押物的数量';
          this.operationModal.name = 'SNEO';
          let sneoMax = find(this.assets, o => o.symbol === 'SNEO');
          if (sneoMax) {
            opSarMax = sneoMax.balance;
          }
          amount = opSarMax;
        }
        //draw sneo
        if (type === "withdraw") {
          this.operationModal.title = locale === 'en' ? 'Draw Collateral' : '提取抵押物';
          this.operationModal.desc = locale === 'en' ?
            'Input collateral amount to be drawn' : '请输入提取抵押物的数量';
          this.operationModal.name = 'SNEO';
          opSarMax = mySar.availSdsCanfree > 0 ? mySar.availSdsCanfree : 0;
          amount = mySar.initAvailSdsCanfree > 0 ? mySar.initAvailSdsCanfree : 0;
        }
        //issue sdusd
        if (type === "expande") {
          this.operationModal.title = locale === 'en' ? 'Issue Stablecoin' : '发行稳定币';
          this.operationModal.desc = locale === 'en' ?
            'Input issue amount' : '请输入发行稳定币的数量';
          this.operationModal.name = 'SDUSD';
          opSarMax = mySar.wenCanDraw > 0 ? mySar.wenCanDraw : 0;
          amount = mySar.initWenCanDraw > 0 ? mySar.initWenCanDraw : 0;
        }
        //return sdusd
        if (type === "contract") {
          this.operationModal.name = 'SDUSD';
          this.operationModal.title = locale === 'en' ? 'Return Stablecoin' : '归还稳定币';
          this.operationModal.desc = locale === 'en' ?
            'Input return amount' : '请输入回收稳定币的数量';
          opSarMax = mySar.sarHasDrawed;
          let tempObj = find(this.assets, o => o.symbol === 'SDUSD');
          let balance = tempObj ? tempObj.balance : 0;
          let sarHasDrawed = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(mySar.sarHasDrawed))
                .divide(bigmath.bignumber(bigmath.pow(10, 8)))
                .done()
            )
          );

          if (Number(sarHasDrawed) > Number(balance)) {
            opSarMax = balance;
          } else {
            opSarMax = sarHasDrawed;
          }
          amount = opSarMax;
        }
        //add sds
        if (type === 'recharge') {
          this.operationModal.title = locale === 'en' ? 'Add SDS (For Deducting Service Fee)' : '充值SDS(用于抵扣手续费)';
          this.operationModal.desc = locale === 'en' ?
            'Input SDS amount to be recharged' : '请输入充值SDS的数量';
          this.operationModal.name = 'SDS';
          let tempObj = find(this.assets, o => o.symbol === 'SDS');
          if (tempObj) {
            opSarMax = tempObj.balance;
          }
          amount = opSarMax;
        }
        //draw sds
        if (type === 'claimFee') {
          this.operationModal.title = locale === 'en' ? 'Draw SDS' : '提取SDS';
          this.operationModal.desc = locale === 'en' ?
            'Input SDS amount to be refunded' : '请输入提取SDS的数量';
          this.operationModal.name = 'SDS';
          opSarMax = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(mySar.sdsFee))
                .divide(bigmath.bignumber(bigmath.pow(10, 8)))
                .done()
            )
          ) || 0;
          amount = opSarMax;
        }

        opSarMax = +opSarMax;
        amount = +amount;
        this.operationModal.amount = amount;
        this.operationModal.max = opSarMax;

        //get status and rate after mortgage
        this.getAfterMortgageRate();
      },
      async getAfterMortgageRate() {
        if (!this.operationModal.amount) {
          this.operationModal.amount = 0;
        }
        let type = this.operationModal.type;
        if (type === 'recharge' || type === 'claimFee') {
          this.confirmBtn = false;
          return;
        }

        let {sneo_price, liquidate_line_rate_c} = this.sarConfig;
        let {sarLocked, sarHasDrawed} = this.mySar;
        let sneoAmount, sdusdAmount;

        //operationModal.amount
        let mount = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(this.operationModal.amount))
              .multiply(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 0
        );
        mount = +mount;
        //add sneo
        if (type === 'reserve') {
          sneoAmount = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(mount))
                .add(bigmath.bignumber(sarLocked))
                .done()
            ), 0
          );
          sdusdAmount = sarHasDrawed;
        }
        //draw sneo
        if (type === 'withdraw') {
          sneoAmount = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(sarLocked))
                .subtract(bigmath.bignumber(mount))
                .done()
            ), 0
          );
          sdusdAmount = sarHasDrawed;
        }
        //issue sdusd
        if (type === 'expande') {
          sdusdAmount = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(sarHasDrawed))
                .add(bigmath.bignumber(mount))
                .done()
            ), 0
          );
          sneoAmount = sarLocked;
        }
        //return sdusd
        if (type === 'contract') {
          sdusdAmount = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(sarHasDrawed))
                .subtract(bigmath.bignumber(mount))
                .done()
            ), 0
          );
          sneoAmount = sarLocked;
        }
        sneoAmount = +sneoAmount;
        sdusdAmount = +sdusdAmount;

        //rate
        let rate, rateShow;
        if (sdusdAmount === 0) {
          rate = 0;
          rateShow = '--';
        } else {
          rate = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(sneoAmount))
                .multiply(bigmath.bignumber(sneo_price))
                .divide(bigmath.bignumber(sdusdAmount))
                .divide(bigmath.bignumber(bigmath.pow(10, 8)))
                .multiply(100)
                .done()
            )
          );
          rateShow = formatPrecision(rate, 2) + '%';
        }
        rate = +rate;
        this.operationModal.rate = rate;
        this.operationModal.rateShow = rateShow;

        //status
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

        if (sdusdAmount === 0 || sneoAmount === 0 || rate === 0) {
          status = '0';
        }
        this.operationModal.status = status;

        //calculate need sds fee
        if (type === 'contract') {
          let bigAmount = this.operationModal.amount * bigmath.pow(10, 8);
          let needFee = await this.getNeedSdsFee(bigAmount);
          this.operationModal.needFee = needFee;
          let bigNeedFee = parseInt(needFee * bigmath.pow(10, 8));
          this.confirmBtn = bigNeedFee > this.mySar.sdsFee ? true : false;
        } else {
          this.confirmBtn = false;
        }
      },
      async operationSar() {
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
        let type = this.operationModal.type;
        let scAddr = this.sarAddr.sarC.hash;
        let {wif, address} = this.currentUser;
        let amount = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(this.operationModal.amount))
              .multiply(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 0
        );
        let params = [
          "(addr)" + address,
          "(int)" + amount,
        ];

        let r = await eNeo.callC(wif, scAddr, type, params);

        sendDrawTransaction([r.rawData]).then(draw => {
          this.checkTxid(r, draw, () => {
            loading.close();
            location.reload();
          });
        }).catch(() => {
          this.operationModal.show = false;
          this.disabled = false;
        });
      },
      async opRiskModal() {
        if (this.operationModal.amount === 0) {
          return;
        }

        let rateC = this.sarConfig.liquidate_line_rate_c + 50;
        if (this.operationModal.type === 'withdraw' || this.operationModal.type === 'expande') {
          if (this.operationModal.rate < rateC && this.operationModal.status !== '0') {
            this.riskModal = true;
          } else {
            this.operationSar();
          }
        } else {
          this.operationSar();
        }
      },

      //close sar
      async closeSar() {
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
        let scAddr = this.sarAddr.sarC.hash;
        let type = 'close';
        let params = ['(addr)' + address];

        let r = await eNeo.callC(wif, scAddr, type, params);

        sendDrawTransaction([r.rawData]).then(draw => {
          this.checkTxid(r, draw, () => {
            loading.close();
            location.reload();
          });
        }).catch(() => {
          this.closeModal = false;
          this.disabled = false;
        });
      },

      //get sar history detail
      async getHistoryDetail() {
        let params = [this.mySar.sarTxid, 100, 1];
        let historyList = await getSarCHistory(params);
        this.historyList = historyList.result;
        this.historyListShow = this.historyList;
        this.historyModal = true;
      },
      handleTabClick(instance) {
        this.activeTab = instance.name;
        if (this.activeTab === 'sar') {
          this.historyListShow = this.historyList;
        }
        if (this.activeTab === 'liquidation') {
          this.historyListShow = filter(this.historyList, o => o.type === 7);
        }
      },
      beforeHistoryClose() {
        this.activeTab = 'sar';
        this.historyModal = false;
      },
    },
    filters: {
      filterMethod,
      filterTime,
      numFormat,
      filterTxid(val) {
        return val.slice(0, 3) + "..." + val.substr(val.length - 3);
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/var";

  .create-btn {
    margin: 45px 0;
    padding: 12px 25px;
    font-size: 18px;
  }

  .sar-detail {
    height: 216px;
    &-info {
      width: 920px;
      float: left;
      height: 216px;
    }
    &-controls {
      position: relative;
      width: 278px;
      float: left;
      height: 216px;
      padding: 0 24px;
      button {
        width: 110px !important;
        height: 32px !important;
        line-height: 32px !important;
        text-align: center !important;
        padding: 0 !important;
      }
      .contract-info {
        position: absolute;
        top: 50%;
        right: -20px;
        transform: translateY(-50%);
        cursor: pointer;
      }
    }
    &-item {
      float: left;
      width: 184px;
      border-bottom: 1px solid $--border-color-base;
      border-right: 1px solid $--border-color-base;
      box-sizing: border-box;
      height: 108px;
      padding-left: 20px;
      &.no-border-bottom {
        border-bottom: 0;
      }
      &__val {
        margin-top: 36px;
        font-size: 18px;
        font-weight: bold;
        word-wrap: break-word;
      }
      &__title {
        font-size: 12px;
        color: #667;
        margin-top: 6px;
      }
    }
  }

  .sar-modal {
    .liquidation-info {
      color: #667;
      line-height: 30px;
      border-bottom: 1px solid $--border-color-base;
    }
    .close-sar-info {
      margin-top: 60px;
      line-height: 32px;
    }
    .sds-fee-info {
      font-size: 12px;
      color: $--color-danger;
      margin-top: 6px;
    }
    .warn-info {
      font-size: 12px;
      color: $--color-danger;
      margin-top: 6px;
    }
  }

  .risk-modal {
    &-content {
      padding: 40px 0 80px;
      line-height: 1.3;
      &__title {
        color: #334;
        font-weight: bold;
      }
      &__detail {
        color: #667;
        margin-top: 20px;
        padding-left: 20px;
      }
    }
  }

  .recover-modal-info {
    padding: 80px 0;
    text-align: center;
    line-height: 20px
  }
</style>

<style lang="scss">
  @import "../../assets/styles/var";

  .no-header-modal {
    .el-dialog__header {
      display: none;
    }
  }

  .content-no-padding {
    .el-card__body {
      padding: 0 !important;
    }
  }
</style>

