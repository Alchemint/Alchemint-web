<template>
  <el-card class="border-card content-no-padding">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">{{$t('individual.mySar.title')}}</span>
    </div>
    <div class="align-center" v-if="!mySar">
      <el-button class="create-btn"
                 type="primary"
                 :disabled="createBtn"
                 @click="handleCreateSar">{{$t('individual.mySar.createSar')}}
      </el-button>
    </div>
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
            <el-tooltip popper-class="global-popper"
                        placement="bottom-start"
                        offset="100"
                        effect="light">
              <div slot="content">
                <ul class="tooltip-ul" v-html="$t('individual.statusInfo')"></ul>
              </div>
              <icon-font name="icon-wenhao" class="green"></icon-font>
            </el-tooltip>
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
                     @click="opSarShow('reserve')">
            {{$t('individual.mySar.increase')}}
          </el-button>
          <el-button type="primary"
                     plain
                     :disabled="withdrawBtn"
                     @click="opSarShow('withdraw')">
            {{$t('individual.mySar.draw')}}
          </el-button>
        </div>
        <div class="mt-10" style="position: relative">
          <el-button type="primary"
                     plain
                     :disabled="expandeBtn"
                     @click="opSarShow('expande')">
            {{$t('individual.mySar.issue')}}
          </el-button>
          <el-button type="primary"
                     plain
                     :disabled="contractBtn"
                     @click="opSarShow('contract')">
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
                     @click="opSarShow('recharge')">
            {{$t('individual.mySar.recharge')}}
          </el-button>
          <el-button type="primary"
                     plain
                     :disabled="claimFeeBtn"
                     @click="opSarShow('claimFee')">
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
                     @click="recoverModal=true">{{$t('individual.mySar.closeSar')}}
          </el-button>
        </div>
      </div>
    </div>

    <!--sar operation  dialog-->
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
        <div class="resuce-info mt-20 clearfix" v-if="operationModal.type==='contract'">
          <span class="fl">{{$t('individual.mySar.fee')}}</span>
          <span class="fr">{{operationModal.needFee}} SDS</span>
        </div>
        <div class="sds-fee-info" v-if="confirmBtn">{{$t('individual.mySar.insufficientFee')}}</div>
        <div class="resuce-info mt-20 clearfix">
          <span class="fl">{{$t('individual.mySar.afterMortgageRate')}}</span>
          <span class="fr">{{operationModal.rateShow}}</span>
        </div>
        <div class="resuce-info mt-20 clearfix">
          <span class="fl">{{$t('individual.mySar.afterStatus')}}
             <el-tooltip popper-class="global-popper"
                         placement="bottom-start"
                         offset="100"
                         effect="light">
              <div slot="content" class="tooltip-ul" v-html="$t('individual.statusInfo')"></div>
              <icon-font name="icon-wenhao" class="green"></icon-font>
            </el-tooltip>
          </span>
          <span :class="['fr',{'green':operationModal.status==='0',
                               'blue':operationModal.status==='1',
                               'yellow':operationModal.status==='2',
                               'red':operationModal.status==='3'}]">
            {{operationModal.status | filterMethod($t('sarCStatus'))}}
          </span>
        </div>
      </div>
      <div slot="footer">
        <el-button class="sar-modal-btn"
                   @click="operationModal.show = false">{{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn"
                   type="primary"
                   :disabled="confirmBtn"
                   @click="opSar">{{$t('global.confirmBtn')}}
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
               :visible.sync="recoverModal">
      <div class="close-sar-info align-center">{{$t('individual.mySar.closeSarInfo')}}</div>
      <div class="align-center mt-40">{{$t('individual.mySar.closeSarSure')}}</div>
      <div slot="footer">
        <el-button class="sar-modal-btn"
                   @click="recoverModal=false">{{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn" type="primary"
                   @click="recoverySar">{{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--history dialog-->
    <el-dialog class="sar-modal history-modal no-header-modal"
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
        <el-tab-pane :label="$t('global.history.liquidatioOperationHistory')" name="resuce">
          <history-detail v-if="historyList"
                          :data="historyListShow"></history-detail>
        </el-tab-pane>
      </el-tabs>
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
        recoverModal: false,
        historyModal: false,
        historyList: null,
        historyListShow: null,
        createBtn: true,
        reserveBtn: true,
        withdrawBtn: true,
        expandeBtn: true,
        contractBtn: true,
        rechargeBtn: true,
        claimFeeBtn: true,
        closeBtn: true,
        activeTab: 'sar',
        disabled: false,
        confirmBtn: false,
      }
    },
    mixins: [sarAddr, checkTxid],
    components: {
      historyDetail,
    },
    async mounted() {
      let mySar = await this.$parent.getSarInfo(this.sarConfig, this.currentUser.address);
      this.createBtn = false;
      if (mySar) {
        this.mySar = mySar;
        this.$parent.hasMySar = true;

        //add sneo button status
        let sneoMax = find(this.assets, o => o.symbol === 'SNEO');
        if (sneoMax) {
          this.reserveBtn = Number(sneoMax.balance) <= 0 ? true : false;
        } else {
          this.reserveBtn = true;
        }

        //draw sneo button status
        this.withdrawBtn = Number(mySar.availSdsCanfree) <= 0 ? true : false;

        //issue sdusd button status
        this.expandeBtn = Number(mySar.wenCanDraw) <= 0 ? true : false;

        //return sdusd button status
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

        //add sds button status
        let sdsVal = find(this.assets, o => o.symbol === 'SDS');
        if (sdsVal) {
          this.rechargeBtn = Number(sdsVal.balance) <= 0 ? true : false;
        } else {
          this.rechargeBtn = true;
        }

        //draw sds button status
        this.claimFeeBtn = Number(mySar.sdsFee) <= 0 ? true : false;

        //close sar button status
        if (Number(mySar.sarHasDrawed) === 0
          && Number(mySar.sarLocked) === 0
          && Number(mySar.sdsFee) === 0
          && Number(mySar.fee) === 0
          && Number(mySar.bondDrawed) === 0) {
          this.closeBtn = false;
        } else {
          this.closeBtn = true;
        }

        //need sds pay
        this.needFee = await this.getSDSFee(mySar.sarHasDrawed);
      }
    },
    methods: {
      //get block height
      async getCurrentBlockHeight() {
        let _currentHeight = await getBlockCount([]);
        let currentHeight = _currentHeight.result;
        let blockHeight;
        if (currentHeight) {
          blockHeight = currentHeight[0].blockcount;
        }
        return blockHeight;
      },

      //need sds pay
      async getSDSFee(mount) {
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

        let needUSDFee;
        if (Number(mount === 0)) {
          needUSDFee = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(currFee))
                .add(bigmath.bignumber(this.mySar.fee))
                .done()
            )
          );
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
        let needFee = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(needUSDFee))
              .divide(bigmath.bignumber(this.sarConfig.sds_price))
              .done()
          )
        );
        return needFee;
      },

      //create sar
      async handleCreateSar() {
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

      //pop sar dialog
      opSarShow(type) {
        this.operationModal.show = true;
        this.operationModal.type = type;

        let locale = this.$i18n.locale;

        let mySar = this.mySar;
        let opSarMax = 0;

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
        }

        //draw sneo
        if (type === "withdraw") {
          this.operationModal.title = locale === 'en' ? 'Draw Collateral' : '提取抵押物';
          this.operationModal.desc = locale === 'en' ?
            'Input collateral amount to be drawn' : '请输入提取抵押物的数量';
          this.operationModal.name = 'SNEO';
          opSarMax = mySar.availSdsCanfree > 0 ? mySar.availSdsCanfree : 0;
        }

        //issue sdusd
        if (type === "expande") {
          this.operationModal.title = locale === 'en' ? 'Issue Stablecoin' : '发行稳定币';
          this.operationModal.desc = locale === 'en' ?
            'Input issue amount' : '请输入发行稳定币的数量';
          this.operationModal.name = 'SDUSD';
          opSarMax = mySar.wenCanDraw > 0 ? mySar.wenCanDraw : 0;
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
        }

        opSarMax = +opSarMax;
        this.operationModal.amount = opSarMax;
        this.operationModal.max = opSarMax;

        this.getAfterMortgageRate();
      },

      //calculate rate and status after input change
      async getAfterMortgageRate() {
        let type = this.operationModal.type;
        if (type === 'recharge' || type === 'claimFee') {
          this.confirmBtn = false;
          return;
        }

        let {sneo_price, liquidate_line_rate_c} = this.sarConfig;
        let {sarLocked, sarHasDrawed} = this.mySar;
        let sneoAmount, sdusdAmount;

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

        //liquidated status
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

        if (sdusdAmount === 0 || sneoAmount === 0 || rate === 0) {
          status = '0';
        }
        this.operationModal.status = status;

        //need sds pay
        if (type === 'contract') {
          let bigAmount = this.operationModal.amount * bigmath.pow(10, 8);
          let needFee = await this.getSDSFee(bigAmount);
          this.operationModal.needFee = needFee;
          let bigNeedFee = parseInt(needFee * bigmath.pow(10, 8));
          this.confirmBtn = bigNeedFee > this.mySar.sdsFee ? true : false;
        } else {
          this.confirmBtn = false;
        }
      },

      //sar operation
      async opSar() {
        if (this.operationModal.amount === 0) {
          return;
        }
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

      //close sar
      async recoverySar() {
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
          this.recoverModal = false;
          this.disabled = false;
        });
      },

      //history detail
      async getHistoryDetail() {
        let params = [this.mySar.sarTxid, 10000, 1];
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
        if (this.activeTab === 'resuce') {
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
      }
      &__title {
        font-size: 12px;
        color: #667;
        margin-top: 6px;
      }
    }
  }

  .contract-info {
    position: absolute;
    top: 50%;
    right: -20px;
    transform: translateY(-50%);
    cursor: pointer;
  }

  .recover-modal-info {
    padding: 80px 0;
    text-align: center;
    line-height: 20px
  }

  .close-sar-info {
    margin-top: 60px;
    line-height: 32px;
  }

  .resuce-info {
    color: #667;
    line-height: 30px;
    border-bottom: 1px solid $--border-color-base;
  }

  .sds-fee-info {
    font-size: 12px;
    color: $--color-danger;
    margin-top: 6px;
  }
</style>

<style lang="scss">
  @import "../../assets/styles/var";

  .content-no-padding {
    .el-card__body {
      padding: 0 !important;
    }
  }
</style>

