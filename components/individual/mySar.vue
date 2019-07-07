<template>
  <el-card class="border-card content-no-padding">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">{{$t('individual.mySar.title')}}</span>
      <el-button class="quick-sar-btn"
                 type="primary"
                 @click.native="validateQuickSar">{{$t('individual.mySar.quickSarModal.title')}}
      </el-button>
      <el-tooltip popper-class="global-popper"
                  placement="bottom-end"
                  effect="light">
        <ul slot="content" class="tooltip-ul" v-html="$t('individual.mySar.quickSarInfo')"></ul>
        <icon-font name="icon-wenhao" class="green quick-sar-info"></icon-font>
      </el-tooltip>
    </div>
    <!--创建sar-->
    <div class="align-center" v-if="!mySar">
      <el-button class="create-btn"
                 type="primary"
                 :disabled="createBtn"
                 @click="validateCreateSar">{{$t('individual.mySar.createSar')}}
      </el-button>
    </div>

    <!--我的sar信息-->
    <div v-else class="sar-detail clearfix">
      <div class="sar-detail-info">
        <div class="sar-detail-item">
          <div class="sar-detail-item__val">{{mySar.txid | filterTxid}}</div>
          <div class="sar-detail-item__title">TXID</div>
        </div>
        <div class="sar-detail-item" :title="setDp(mySar.remainDrawed)">
          <div class="sar-detail-item__val">{{mySar.remainDrawed | decimalPlaces(2)}}</div>
          <div class="sar-detail-item__title">{{$t('individual.mySar.sdusdRemained')}}</div>
        </div>
        <div class="sar-detail-item" :title="setDp(mySar.remainDrawedNEO)">
          <div class="sar-detail-item__val">{{mySar.remainDrawedNEO | decimalPlaces(2)}}</div>
          <div class="sar-detail-item__title">{{$t('individual.mySar.sneoDrawable')}}</div>
        </div>
        <div class="sar-detail-item">
          <div :title="setDp(mySar.mortgageRate)+'%'"
               :class="['sar-detail-item__val',{
                'blue':mySar.status==='1',
                'yellow':mySar.status==='2',
                'red':mySar.status==='3',
                }]">{{mySar.mortgageRate | decimalPlaces(2)}}%
          </div>
          <div class="sar-detail-item__title">{{$t('individual.mySar.sarRate')}}</div>
        </div>
        <div class="sar-detail-item" :title="setDp(mySar.sdsFee)">
          <div class="sar-detail-item__val">{{mySar.sdsFee | decimalPlaces(2)}}</div>
          <div class="sar-detail-item__title">{{$t('individual.mySar.feeBalance')}}</div>
        </div>
        <div class="sar-detail-item no-border-bottom">
          <div :class="['sar-detail-item__val',{
                'blue':mySar.status==='1',
                'yellow':mySar.status==='2',
                'red':mySar.status==='3' ,
                }]">
            {{mySar.status | filterMethod($t('sarCStatus'))}}
          </div>
          <div class="sar-detail-item__title">{{$t('individual.mySar.status')}}
            <status-tooltip v-if="typeA" :type-a="typeA"></status-tooltip>
          </div>
        </div>
        <div class="sar-detail-item no-border-bottom" :title="setDp(mySar.hasDrawed)">
          <div class="sar-detail-item__val">{{mySar.hasDrawed | decimalPlaces(2)}}</div>
          <div class="sar-detail-item__title">{{$t('individual.mySar.sdusdIssued')}}</div>
        </div>
        <div class="sar-detail-item no-border-bottom" :title="setDp(mySar.locked)">
          <div class="sar-detail-item__val">{{mySar.locked | decimalPlaces(2)}}</div>
          <div class="sar-detail-item__title">{{$t('individual.mySar.sneoCollateralized')}}</div>
        </div>
        <div class="sar-detail-item no-border-bottom" :title="setDp(mySar.liqPrice)">
          <div class="sar-detail-item__val">{{mySar.liqPrice | decimalPlaces(2)}}</div>
          <div class="sar-detail-item__title">{{$t('individual.mySar.liquidationPrice')}}</div>
        </div>
        <div class="sar-detail-item no-border-bottom" :title="setDp(mySar.toPay?mySar.toPay:0)">
          <div class="sar-detail-item__val">{{(mySar.toPay?mySar.toPay:0) | decimalPlaces(2)}}</div>
          <div class="sar-detail-item__title">{{$t('individual.mySar.feeGenerated')}}</div>
        </div>
      </div>
      <div class="sar-detail-controls">
        <div style="margin-top: 29px">
          <el-button type="primary"
                     plain
                     @click="opOperationModal('reserve')">
            {{$t('individual.mySar.increase')}}
          </el-button>
          <el-button type="primary"
                     plain
                     @click="opOperationModal('withdraw')">
            {{$t('individual.mySar.draw')}}
          </el-button>
        </div>
        <div class="mt-10" style="position: relative">
          <el-button type="primary"
                     plain
                     @click="opOperationModal('expande')">
            {{$t('individual.mySar.issue')}}
          </el-button>
          <el-button type="primary"
                     plain
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
                     @click="opOperationModal('recharge')">
            {{$t('individual.mySar.recharge')}}
          </el-button>
          <el-button type="primary"
                     plain
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
                     @click="closeModal = true">{{$t('individual.mySar.closeSar')}}
          </el-button>
        </div>
      </div>
    </div>

    <!--操作sar模态框-->
    <el-dialog class="sar-modal"
               :title="operationModal.title"
               label-position="top"
               center
               :show-close="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :lock-scroll="false"
               :visible.sync="operationModal.show">
      <el-form @submit.native.prevent ref="operationSarC"
               :model="operationModal"
               :rules="operationRules">
        <el-form-item :label="operationModal.name" prop="amount">
          <el-input-number v-model.number="operationModal.amount"
                           controls-position="right"
                           :min="0"
                           :disabled="operationModal.max===0"
                           :max="operationModal.max"
                           @change="getMortgageRateAfterOperation"
                           style="width: 100%"></el-input-number>
        </el-form-item>
        <el-slider v-model="operationModal.amount"
                   :step="0.00000001"
                   :disabled="operationModal.max===0"
                   :min="0"
                   @change="getMortgageRateAfterOperation"
                   :max="operationModal.max"></el-slider>
      </el-form>
      <div v-if="operationModal.type!=='recharge' && operationModal.type!=='claimFee'">
        <div class="liquidation-info mt-20 clearfix" v-if="operationModal.type==='contract'">
          <span class="fl">{{$t('individual.mySar.fee')}}</span>
          <span class="fr">{{operationModal.needFee | decimalPlaces()}} SDS</span>
        </div>
        <div class="sds-fee-info" v-if="!operationModal.sufficientFee">
          {{$t('individual.mySar.insufficientFee')}}
        </div>
        <div class="liquidation-info mt-20 clearfix">
          <span class="fl">{{$t('individual.mySar.afterMortgageRate')}}</span>
          <span class="fr">{{operationModal.rate | decimalPlaces(2)}}%</span>
        </div>
        <div class="liquidation-info mt-20 clearfix">
          <span class="fl">{{$t('individual.mySar.afterStatus')}}
             <status-tooltip v-if="typeB" :type-a="typeA"></status-tooltip>
          </span>
          <span :class="['fr',{'green':operationModal.status==='0',
                               'blue':operationModal.status==='1',
                               'yellow':operationModal.status==='2',
                               'red':operationModal.status==='3'}]">
            {{operationModal.status | filterMethod($t('sarCStatus'))}}
          </span>
        </div>
        <div class="warn-info" v-if="operationModal.rate < lineRateC + 50 && operationModal.status!=='0'">
          <i class="el-icon-warning"></i>
          <span>&nbsp;{{$t('individual.mySar.liquidationRiskInfo',{topRate:lineRateC + 50})}}</span>
        </div>
      </div>
      <el-checkbox class="mt-30" v-model="gasFee">{{$t('global.feeInfo')}}</el-checkbox>
      <div slot="footer">
        <el-button class="sar-modal-btn"
                   @click="resetOperationModal">{{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn"
                   type="primary"
                   @click="validateOperationForm">{{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--关闭sar模态框-->
    <el-dialog class="sar-modal"
               :title="$t('individual.mySar.closeSar')"
               label-position="top"
               center
               @close="closeErr=''"
               :lock-scroll="false"
               :show-close="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="closeModal">
      <div class="close-sar-info align-center">{{$t('individual.mySar.closeSarInfo')}}</div>
      <div class="align-center mt-40">{{$t('individual.mySar.closeSarSure')}}</div>
      <div class="align-center mt-60 red" v-if="closeErr">{{closeErr}}</div>
      <div class="mt-30 align-center">
        <el-checkbox v-model="gasFee">{{$t('global.feeInfo')}}</el-checkbox>
      </div>
      <div slot="footer">
        <el-button class="sar-modal-btn"
                   @click="closeModal=false">{{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn" type="primary"
                   @click="validateCloseSar">{{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--sar历史记录模态框-->
    <el-dialog class="sar-modal no-header-modal"
               :title="$t('global.history.sarOperationHistory')"
               width="1000px"
               label-position="top"
               center
               :show-close="true"
               stripe
               :lock-scroll="false"
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

    <!--操作sar警告模态框-->
    <el-dialog class="sar-modal risk-modal"
               :title="$t('individual.mySar.riskModal.title')"
               label-position="top"
               center
               :show-close="false"
               :lock-scroll="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="riskModal">
      <div class="risk-modal-content">
        <div class="risk-modal-content__title">
          {{$t('individual.mySar.riskModal.infoTitle',{topRate:lineRateC + 50})}}
        </div>
        <ul class="risk-modal-content__detail"
            v-html="$t('individual.mySar.riskModal.infoDetail',{lineRate:lineRateC})"></ul>
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
                     style="padding:10px 0"
                     @click="operationSar">{{$t('individual.mySar.riskModal.confirmBtn')}}
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!--一键发币模态框-->
    <el-dialog class="sar-modal quick-sar-modal"
               :title="$t('individual.mySar.quickSarModal.title')"
               label-position="top"
               center
               :show-close="false"
               :lock-scroll="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="quickSarModal.show">
      <el-steps :active="activeStep"
                finish-status="success"
                class="quick-sar-steps"
                v-if="quickSarSteps">
        <el-step v-for="(item,index) in quickSarSteps" :key="index">
          <span slot="title" v-html="$i18n.locale==='zh'?item.zhTitle:item.enTitle"></span>
        </el-step>
      </el-steps>
      <div class="quick-sar-content">
        <!--form-->
        <el-form @submit.native.prevent>
          <el-form-item :label="$t('individual.mySar.quickSarModal.collateralizeNeo')" prop="neoAmount">
            <el-input-number v-model.number="quickSarModal.neoAmount"
                             controls-position="right"
                             :min="0"
                             :disabled="quickSarModal.neoMax===0"
                             :max="quickSarModal.neoMax"
                             @change="quickSarNeoChange"
                             style="width: 100%"></el-input-number>
          </el-form-item>
          <el-slider v-model="quickSarModal.neoAmount"
                     :step="1"
                     :min="0"
                     :disabled="quickSarModal.neoMax===0"
                     @change="quickSarNeoChange"
                     :max="quickSarModal.neoMax"></el-slider>
          <el-form-item :label="$t('individual.mySar.quickSarModal.issueSdusd')" prop="sdusdAmount">
            <el-input-number v-model.number="quickSarModal.sdusdAmount"
                             controls-position="right"
                             :min="0"
                             :max="quickSarModal.sdusdMax"
                             :disabled="quickSarModal.sdusdMax===0"
                             @change="quickSarSdusdChange"
                             style="width: 100%"></el-input-number>
          </el-form-item>
          <el-slider v-model="quickSarModal.sdusdAmount"
                     :step="0.00000001"
                     :min="0"
                     :disabled="quickSarModal.sdusdMax===0"
                     @change="quickSarSdusdChange"
                     :max="quickSarModal.sdusdMax"></el-slider>
          <el-form-item :label="$t('global.fee')">
            <el-checkbox class="mt-10" v-model="gasFee">{{$t('global.feeInfo')}}</el-checkbox>
          </el-form-item>
        </el-form>
        <!--状态-->
        <div>
          <div class="liquidation-info mt-20 clearfix">
            <span class="fl">{{$t('individual.mySar.afterMortgageRate')}}</span>
            <span class="fr">{{quickSarModal.rate | decimalPlaces(2)}}%</span>
          </div>
          <div class="liquidation-info mt-20 clearfix">
          <span class="fl">{{$t('individual.mySar.afterStatus')}}
             <status-tooltip v-if="typeB" :type-a="typeA"></status-tooltip>
          </span>
            <span :class="['fr',{'green':quickSarModal.status==='0',
                               'blue':quickSarModal.status==='1',
                               'yellow':quickSarModal.status==='2',
                               'red':quickSarModal.status==='3'}]">
            {{quickSarModal.status | filterMethod($t('sarCStatus'))}}
          </span>
          </div>
          <div class="warn-info" v-if="quickSarModal.rate < lineRateC + 50 && quickSarModal.status!=='0'">
            <i class="el-icon-warning"></i>
            <span>&nbsp;{{$t('individual.mySar.liquidationRiskInfo',{topRate:lineRateC + 50})}}</span>
          </div>
        </div>
      </div>
      <!--按钮组-->
      <div slot="footer">
        <el-button class="sar-modal-btn"
                   @click="quickSarModal.show = false">{{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn"
                   type="primary"
                   @click.native="quickSar">{{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--是否需要手续费-->
    <el-dialog class="sar-modal"
               :title="$t('global.fee')"
               label-position="top"
               center
               :show-close="false"
               :lock-scroll="false"
               :visible.sync="feeDialog">
      <el-checkbox class="mt-30" v-model="gasFee">{{$t('global.feeInfo')}}</el-checkbox>
      <div slot="footer">
        <el-button class="full-btn"
                   plain
                   type="primary"
                   @click.native="createSar">{{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--硬件钱包签名提示-->
    <cold-wallet-dialog :cold-wallet-dialog-visible="coldWalletDialogVisible"></cold-wallet-dialog>
  </el-card>
</template>

<script>
  import getSarAddr from '~/mixins/getSarAddr'
  import checkTxid from '~/mixins/checkTxid'
  import {getBlockCount, getUtxo, sendDrawTransaction} from "~/api/global";
  import {cloneDeep, filter, find, findIndex} from 'lodash'
  import {getSarCHistory} from '~/api/individual'
  import historyDetail from '~/components/public/historyDetail'
  import statusTooltip from './statusTooltip'
  import getLeaderPubkey from '~/mixins/getLeaderPubkey'
  import {getsar4CDetailByAdd} from '~/api/individual'
  import {getCurrentUser} from '~/utils/login'
  import {setDp, BN} from '~/utils/core'
  import {filterMethod, decimalPlaces, filterTime} from '~/filters/core'
  import {LOADING_OPTION, EIGHT_POWER, SIXTEEN_POWER, SIX_POWER} from '~/filters/const'
  import {mapGetters} from 'vuex'
  import sarC from '~/mixins/sarC'
  import eNeo from '~/utils/eNeo'

  const quickSarSteps = [
    {
      name: 'create',
      zhTitle: 'SAR<br>创建',
      enTitle: 'Creat<br>SAR',
    },
    {
      name: 'convert',
      zhTitle: 'NEO<br>转化',
      enTitle: 'Convert<br>NEO',
    },
    {
      name: 'mortgage',
      zhTitle: 'SNEO<br>抵押',
      enTitle: 'Mortgage<br>SNEO',
    },
    {
      name: 'mint',
      zhTitle: 'SDUSD<br>发行',
      enTitle: 'Issue<br>SDUSD',
    },
  ];
  export default {
    name: 'MySar',
    props: ['assets'],
    data() {
      return {
        currentUser: null, //用户信息
        mySar: null,  //我的sar信息
        btnLocked: false,  //按钮锁定，避免多次弹框
        gasFee: false, //是否需要支付0.001GAS手续费
        feeDialog: false,

        //创建sar
        createBtn: true,

        //操作sar
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
          needFee: '', //所需手续费
          sufficientFee: false, //sds足够支付归还稳定币的手续费
        },
        operationRules: {
          amount: [
            {
              validator: this.validateAmount, trigger: 'blur',
            }
          ]
        },

        //关闭sar
        closeModal: false,
        closeErr: '',


        //风险告知模态框
        riskModal: false,

        //一键发币
        quickSarModal: {
          show: false,
          neoAmount: 0,
          neoMax: 0,
          sdusdAmount: 0,
          sdusdMax: 0,
          rate: '',
          status: '',
        },
        quickSarBtn: true,
        quickSarSteps: null,
        activeStep: 0,

        //历史记录
        historyModal: false,
        historyList: null,
        historyListShow: null,
        activeTab: 'sar',
      }
    },
    computed: {
      ...mapGetters(['typeB', 'typeA']),
      lineRateC() {
        if (this.typeA) {
          return find(this.typeA, o => o.key === 'liquidate_line_rate_c').value;
        }
      },
      sneoPrice() {
        if (this.typeB) {
          return find(this.typeB, o => o.key === 'sneo_price').value;
        }
      }
    },
    mixins: [getSarAddr, checkTxid, getLeaderPubkey, sarC],
    components: {
      historyDetail,
      statusTooltip
    },
    filters: {
      filterMethod,
      decimalPlaces,
      filterTime,
      filterTxid(val) {
        if (!val) {
          return;
        }
        return val.slice(2, 5) + "..." + val.substr(val.length - 3);
      }
    },
    async mounted() {
      //获得用户信息
      let user = getCurrentUser(this);
      this.currentUser = user;

      //未登录,创建sar启用
      if (!user) {
        this.createBtn = false;
        return;
      }

      //获取typeB数据
      if (!this.typeB) {
        await this.$store.dispatch('getTypeB');
      }

      //获取typeA数据
      if (!this.typeA) {
        await this.$store.dispatch('getTypeA');
      }

      //获取Sar数据
      this.getSarCInfo();
    },
    methods: {
      setDp,

      //获取我的sar信息
      async getSarCInfo() {
        let _mySar = await getsar4CDetailByAdd([this.currentUser.address, this.sarAddr.sarC.hash]);
        let mySar = _mySar.result;
        if (!mySar) {
          this.createBtn = false;
          this.quickSarBtn = false;
          this.mySar = null;
          return;
        }

        mySar = mySar[0];
        //数据处理
        this.mySar = this.handleSarCData(mySar);

        //更改数据状态
        this.createBtn = false;
        this.quickSarBtn = false;
        this.$parent.hasMySar = true;
      },
      //处理sarC数据
      handleSarCData(mySar) {
        let {hasDrawed, locked, mortgageRate} = mySar;

        //lineRateC抵押率下,可发行sdusd和可提取sneo的数量
        let {remainSneoBalance, remainSdusdBalance} =
          this.getReturnBalanceByLineRateC(mySar, this.lineRateC, this.sneoPrice);

        //lineRateC+50抵押率下,默认发行sdusd和默认提取sneo的数量
        let _lineRateC = this.lineRateC + 50;
        let initRemainSneoBalance =
          this.getReturnBalanceByLineRateC(locked, hasDrawed, _lineRateC, this.sneoPrice).remainSneoBalance;
        let initRemainSdusdBalance =
          this.getReturnBalanceByLineRateC(locked, hasDrawed, _lineRateC, this.sneoPrice).remainSdusdBalance;

        //清算价格
        let liquidationPrice = new BN(hasDrawed).times(this.lineRateC).div(locked).div(100).toFormat(8, 3);
        let status = this.getSarCStatus(locked, hasDrawed, mortgageRate, this.lineRateC);

        let tempObj = {
          remainSneoBalance: Number(remainSneoBalance),
          remainSdusdBalance: Number(remainSdusdBalance),
          initRemainSneoBalance: Number(initRemainSneoBalance),
          initRemainSdusdBalance: Number(initRemainSdusdBalance),
          liquidationPrice: Number(liquidationPrice),
          status,
        };
        return Object.assign(mySar, tempObj);
      },
      //根据不同的C端清算抵押率计算可发行sdusd和可提取sneo
      getReturnBalanceByLineRateC(locked, hasDrawed, lineRateC, sneo_price) {
        hasDrawed = Number(hasDrawed);
        locked = Number(locked);

        //计算总的sdusd,可发行sdusd
        let totalSdusdBalance = new BN(locked).times(sneo_price).div(lineRateC)
          .times(100).dp(8, 3).toNumber();
        let remainSdusdBalance = new BN(totalSdusdBalance)
          .minus(hasDrawed).dp(8, 3).toNumber();


        //计算已提取sneo和可提取sneo
        let hasDrawSneoBalance = new BN(hasDrawed).times(lineRateC)
          .div(sneo_price).div(100).dp(8, 3).toNumber();
        let remainSneoBalance = new BN(locked).minus(hasDrawSneoBalance).dp(8, 3).toNumber();

        //返回可发行sdusd和可提取sneo
        remainSdusdBalance = remainSdusdBalance > 0 ? remainSdusdBalance : 0;
        remainSneoBalance = remainSneoBalance > 0 ? remainSneoBalance : 0;

        return {
          remainSneoBalance,
          remainSdusdBalance,
        }
      },

      //获取当前区间高度
      async getCurrentBlockHeight() {
        let _currentHeight = await getBlockCount([]);
        let currentHeight = _currentHeight.result;
        let blockHeight;
        if (currentHeight) {
          blockHeight = currentHeight[0].blockcount;
        }
        return Number(blockHeight);
      },
      //获取需要支付的sds
      async getNeedSdsFee(mount) {
        //currFee = (blockHeight - lastHeight) * hasDrawed * fee_rate / SIXTEEN_POWER;
        let blockHeight = await this.getCurrentBlockHeight();
        let {lastHeight, hasDrawed, fee} = this.mySar;

        let feeRateC = find(this.typeA, o => o.key === 'fee_rate_c').value;
        let sds_price = find(this.typeB, o => o.key === 'sds_price').value;
        let currFee = new BN(blockHeight).minus(lastHeight).times(hasDrawed)
          .times(feeRateC).div(SIXTEEN_POWER).toString();

        currFee = +currFee;

        //needUSDFee = (currFee + fee) * mount / hasDrawed;
        let needUSDFee;
        if (Number(mount === 0)) {
          needUSDFee = 0;
        } else {
          needUSDFee = new BN(currFee).plus(fee)
            .times(mount).div(hasDrawed).toString()
        }
        needUSDFee = +needUSDFee;

        //needFee = needUSDFee * EIGHT_POWER / sdsPrice;
        let needFee = new BN(needUSDFee).div(sds_price).toNumber();
        return needFee;
      },

      //检查是否可以创建sar
      validateCreateSar() {
        let locale = this.$i18n.locale;
        //未登录，跳转到登录界面
        if (!this.currentUser) {
          this.$alert('', locale === 'zh' ? '未登录' : 'Not logged in', {
            confirmButtonText: locale === 'zh' ? '立即登录' : 'Login Now',
            confirmButtonClass: 'login-now-btn',
            customClass: 'login-now-container',
            center: true,
          }).then(() => {
            this.$router.replace({path: `${this.$i18n.locale === 'en' ? '' : '/zh'}/login`});
          });
          return;
        }

        //登录，弹出create模态框
        this.feeDialog = true;
      },
      //创建sar
      async createSar() {
        if (this.btnLocked) {
          return;
        }
        this.btnLocked = true;

        const loading = this.$loading(LOADING_OPTION);
        let {wif, address} = this.currentUser;
        let scAddr = this.sarAddr.sarC.hash;
        let type = 'openSAR4C';
        let params = [
          "(addr)" + address,
          "(str)" + 'sneo_price'
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
            this.btnLocked = false;
            this.getSarCInfo();
            this.updateViewData();
            this.feeDialog = false;
            loading.close();
          });
        }).catch(() => {
          this.btnLocked = false;
          this.feeDialog = false;
          loading.close();
        });
      },

      //操作sar
      opOperationModal(type) {
        this.operationModal.show = true;
        this.operationModal.type = type;

        let locale = this.$i18n.locale;

        let mySar = this.mySar;
        let opSarMax = 0;
        let amount = 0;

        //抵押sneo
        if (type === "reserve") {
          this.operationModal.title = locale === 'en' ? 'Add Collateral' : '增加抵押物';
          this.operationModal.desc = locale === 'en' ?
            'Input collateral amount to be increased' : '请输入增加抵押物的数量';
          this.operationModal.name = 'SNEO';
          let sneoMax = find(this.assets, o => o.assetid === this.sarAddr.sneo.hash);
          if (sneoMax) {
            opSarMax = sneoMax.balance;
          }
          amount = opSarMax;
        }

        //提取sneo
        if (type === "withdraw") {
          this.operationModal.title = locale === 'en' ? 'Draw Collateral' : '提取抵押物';
          this.operationModal.desc = locale === 'en' ? 'Input collateral amount to be drawn' : '请输入提取抵押物的数量';
          this.operationModal.name = 'SNEO';
          opSarMax = mySar.remainDrawedNEO;
          amount = mySar.initRemainSneoBalance;
        }

        //发行SDUSD
        if (type === "expande") {
          this.operationModal.title = locale === 'en' ? 'Issue Stablecoin' : '发行稳定币';
          this.operationModal.desc = locale === 'en' ?
            'Input issue amount' : '请输入发行稳定币的数量';
          this.operationModal.name = 'SDUSD';
          opSarMax = mySar.remainDrawed;
          amount = mySar.initRemainSdusdBalance;
        }

        //归还sdusd
        if (type === "contract") {
          this.operationModal.name = 'SDUSD';
          this.operationModal.title = locale === 'en' ? 'Return Stablecoin' : '归还稳定币';
          this.operationModal.desc = locale === 'en' ?
            'Input return amount' : '请输入回收稳定币的数量';
          let hasDrawed = this.mySar.hasDrawed;
          let tempObj = find(this.assets, o => o.assetid === this.sarAddr.sdusd.hash);
          let balance = tempObj ? tempObj.balance : 0;
          if (Number(hasDrawed) > Number(balance)) {
            opSarMax = balance;
          } else {
            opSarMax = hasDrawed;
          }
          amount = opSarMax;
        }

        //充值sds
        if (type === 'recharge') {
          this.operationModal.title = locale === 'en' ? 'Add SDS (For Deducting Service Fee)' : '充值SDS(用于抵扣手续费)';
          this.operationModal.desc = locale === 'en' ?
            'Input SDS amount to be recharged' : '请输入充值SDS的数量';
          this.operationModal.name = 'SDS';
          let tempObj = find(this.assets, o => o.assetid === this.sarAddr.sds.hash);
          if (tempObj) {
            opSarMax = tempObj.balance;
          }
          amount = opSarMax;
        }

        //提取sdsd
        if (type === 'claimFee') {
          this.operationModal.title = locale === 'en' ? 'Draw SDS' : '提取SDS';
          this.operationModal.desc = locale === 'en' ?
            'Input SDS amount to be refunded' : '请输入提取SDS的数量';
          this.operationModal.name = 'SDS';
          opSarMax = this.mySar.sdsFee || 0;
          amount = opSarMax;
        }

        opSarMax = +opSarMax;
        amount = +amount;
        this.operationModal.amount = amount;
        this.operationModal.max = opSarMax;

        //获取操作后的抵押率和状态
        this.getMortgageRateAfterOperation();
      },
      //检查amount
      validateAmount(rule, value, callback) {
        let locale = this.$i18n.locale;
        let decimals = new BN(value).dp();
        if (Number(value) <= 0) {
          callback(new Error(locale === 'zh' ? '输入值必须大于0' : 'The input value must be greater than 0'));
        } else if (isNaN(value)) {
          callback(new Error(locale === 'zh' ? '输入值必须大于0' : 'The input value must be greater than 0'));
        } else if (decimals > 8) {
          callback(new Error(locale === 'zh' ? '小数位数不能超过8位' : 'The number of decimal places cannot exceed 8 digits'));
        } else {
          callback();
        }
      },
      //校验form表单
      validateOperationForm() {
        this.$refs['operationSarC'].validate((valid) => {
          if (valid) {
            if (this.operationModal.type === 'contract' && !this.operationModal.sufficientFee) {
              return false; //需充值sds
            }
            this.opRiskModal(); //弹出警示框
          } else {
            return false;
          }
        });
      },
      //重置operationModal的form表单
      resetOperationModal() {
        this.operationModal.show = false;
        this.$refs['operationSarC'].resetFields();
      },
      //获取操作后的抵押率和状态
      async getMortgageRateAfterOperation() {
        if (isNaN(this.operationModal.amount)) {
          return;
        }
        let type = this.operationModal.type;
        if (type === 'recharge' || type === 'claimFee') {
          return;
        }

        let sneo_price = find(this.typeB, o => o.key === 'sneo_price').value;
        let lineRateC = find(this.typeA, o => o.key === 'liquidate_line_rate_c').value;
        let {locked, hasDrawed} = this.mySar;
        let sneoAmount, sdusdAmount;
        let amount = Number(this.operationModal.amount);

        //增加sneo
        if (type === 'reserve') {
          sneoAmount = new BN(amount).plus(locked).dp(8, 3).toString();
          sdusdAmount = hasDrawed;
        }
        //提取sneo
        if (type === 'withdraw') {
          sneoAmount = new BN(locked).minus(amount).dp(8, 3).toString();
          sdusdAmount = hasDrawed;
        }
        //发行sdusd
        if (type === 'expande') {
          sdusdAmount = new BN(hasDrawed).plus(amount).dp(8, 3).toString();
          sneoAmount = locked;
        }
        //归还sdusd
        if (type === 'contract') {
          sdusdAmount = new BN(hasDrawed).minus(amount).dp(8, 3).toString();
          sneoAmount = locked;
        }
        sneoAmount = +sneoAmount;
        sdusdAmount = +sdusdAmount;

        //rate抵押率和status状态
        let {rate, status} = this.getRateAndStatus(sneoAmount, sdusdAmount, this.sneoPrice, this.lineRateC);
        this.operationModal.rate = rate;
        this.operationModal.status = status;

        //所需支付sds
        if (type === 'contract') {
          let needFee = await this.getNeedSdsFee(this.operationModal.amount);
          this.operationModal.needFee = needFee;
          this.operationModal.sufficientFee = Number(needFee) <= Number(this.mySar.sdsFee) ? true : false;
        } else {
          this.operationModal.sufficientFee = true;
        }
      },
      //抵押率低于lineRateC+50安全线以下,弹出警示框
      async opRiskModal() {
        let lineRateC = find(this.typeA, o => o.key === 'liquidate_line_rate_c').value;
        let lineRateSafe = lineRateC + 50;
        if (this.operationModal.type === 'withdraw' || this.operationModal.type === 'expande') {
          if (this.operationModal.rate < lineRateSafe && this.operationModal.status !== '0') {
            this.riskModal = true;
          } else {
            this.operationSar();
          }
        } else {
          this.operationSar();
        }
      },
      //发起操作请求
      async operationSar() {
        if (this.btnLocked) {
          return;
        }
        this.btnLocked = true;

        const loading = this.$loading(LOADING_OPTION);

        let type = this.operationModal.type;
        let scAddr = this.sarAddr.sarC.hash;
        let {wif, address} = this.currentUser;
        let amount = new BN(this.operationModal.amount).times(EIGHT_POWER)
          .integerValue().toString();

        let params = [
          "(addr)" + address,
          "(int)" + amount,
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
          this.$message.error('Signature Failure');
          return;
        }

        sendDrawTransaction([r.rawData]).then(draw => {
          this.checkTxid(r, draw, () => {
            this.operationModal.show = false;
            this.riskModal = false;
            this.btnLocked = false;
            this.updateViewData(); //更新数据
            loading.close();
          });
        }).catch(() => {
          this.operationModal.show = false;
          this.riskModal = false;
          this.btnLocked = false;
          loading.close();
        });
      },

      //查验是否可关闭sar
      async validateCloseSar() {
        let {locked, hasDrawed, sdsFee, fee, bondDrawed} = this.mySar;
        if (Number(locked) === 0
          && Number(hasDrawed) === 0
          && Number(sdsFee) === 0
          && Number(fee) === 0
          && Number(bondDrawed) === 0) {
          this.closeSar();
          this.closeErr = '';
          return;
        }

        let locale = this.$i18n.locale;
        this.closeErr = locale === 'zh' ? '提示：各项数值均为0，方可关闭SAR' : 'Tips：All values need to be 0 before closing this SAR.';
      },
      //关闭sar
      async closeSar() {
        if (this.btnLocked) {
          return;
        }
        this.btnLocked = true;
        const loading = this.$loading(LOADING_OPTION);
        let {wif, address} = this.currentUser;
        let scAddr = this.sarAddr.sarC.hash;
        let type = 'close';
        let params = ['(addr)' + address];

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
            this.closeModal = false;
            this.btnLocked = false;
            this.updateViewData();
            loading.close();
          });
        }).catch(() => {
          this.closeModal = false;
          this.btnLocked = false;
          loading.close();
        });
      },

      //轮询之后更新数据
      updateViewData() {
        //更新assets,列表,全局状态,
        this.$emit('update-data');
      },

      /** 一键发币 */
      //检测是否可以一键发币
      validateQuickSar() {
        let locale = this.$i18n.locale;
        //未登录，跳转到登录界面
        if (!this.currentUser) {
          this.$alert('', locale === 'zh' ? '未登录' : 'Not logged in', {
            confirmButtonText: locale === 'zh' ? '立即登录' : 'Login Now',
            confirmButtonClass: 'login-now-btn',
            customClass: 'login-now-container',
            center: true,
          }).then(() => {
            this.$router.replace({path: `${this.$i18n.locale === 'en' ? '' : '/zh'}/login`});
          });
          return;
        }

        //登录，弹出create模态框
        this.opQuickSar();
      },
      //弹出一键发币
      async opQuickSar() {
        this.quickSarModal.show = true;

        if (!this.assets) {
          await this.$parent.getAssets(this.currentUser.address);
        }
        let neoAmount = find(this.assets, o => o.assetid === eNeo.config.neoId).balance;
        neoAmount = +neoAmount;
        this.quickSarModal.neoAmount = neoAmount;
        this.quickSarModal.neoMax = neoAmount;

        await this.quickSarNeoChange(neoAmount);
      },
      async quickSarNeoChange(neoAmount) {
        if (isNaN(neoAmount)) {
          this.quickSarModal.neoAmount = 0;
          return;
        }
        //获得原sar中已抵押SNEO和已发行的SDUSD的量
        let originalLocked, originalHasDrawed;
        if (this.mySar) {
          originalLocked = +this.mySar.locked;
          originalHasDrawed = +this.mySar.hasDrawed;
        } else {
          originalLocked = originalHasDrawed = 0;
        }

        //计算最大可发行SDUSD和默认可发行SDUSD
        let maxIssueSdusd, initIssueSdusd;
        let lineRateC = this.lineRateC;
        let sneo_price = find(this.typeB, o => o.key === 'sneo_price').value;
        //计算总抵押的SNEO
        let totalLocked = new BN(neoAmount).plus(originalLocked).dp(8, 3).toNumber();
        totalLocked = +totalLocked;
        maxIssueSdusd = this.getReturnBalanceByLineRateC(
          totalLocked, originalHasDrawed, lineRateC, sneo_price).remainSdusdBalance;
        initIssueSdusd = this.getReturnBalanceByLineRateC(
          totalLocked, originalHasDrawed, lineRateC + 50, sneo_price).remainSdusdBalance;

        //设置最大值和最优值
        this.quickSarModal.sdusdAmount = +initIssueSdusd;
        this.quickSarModal.sdusdMax = +maxIssueSdusd;

        //计算变化后的抵押率和抵押状态
        //计算总发行SDUSD
        let totalHasDrawed = new BN(initIssueSdusd).plus(originalHasDrawed).dp(8, 3).toNumber();

        let {rate, status} = this.getRateAndStatus(totalLocked, totalHasDrawed, this.sneoPrice, this.lineRateC);
        this.quickSarModal.rate = rate;
        this.quickSarModal.status = status;

        this.quickSarSteps = this.judgeQuickSteps();
      },
      async quickSarSdusdChange(sdusdAmount) {
        if (isNaN(sdusdAmount)) {
          this.quickSarModal.sdusdAmount = 0;
          return;
        }
        //获得原sar中已抵押SNEO和已发行的SDUSD的量
        let originalLocked, originalHasDrawed;
        if (this.mySar) {
          originalLocked = +this.mySar.locked;
          originalHasDrawed = +this.mySar.hasDrawed;
        } else {
          originalLocked = originalHasDrawed = 0;
        }

        //计算变化后的抵押率和抵押状态
        //计算总抵押的SNEO
        let totalLocked = new BN(this.quickSarModal.neoAmount).plus(originalLocked).dp(8, 3).toNumber();
        //计算总发行SDUSD
        let totalHasDrawed = new BN(sdusdAmount).plus(originalHasDrawed).dp(8, 3).toNumber();
        let {rate, status} = this.getRateAndStatus(totalLocked, totalHasDrawed, this.sneoPrice, this.lineRateC);
        this.quickSarModal.rate = rate;
        this.quickSarModal.status = status;

        this.quickSarSteps = this.judgeQuickSteps();
      },
      judgeQuickSteps() {
        let tempArr = cloneDeep(quickSarSteps);

        if (this.mySar) {
          let index = findIndex(tempArr, o => o.name === 'create');
          tempArr.splice(index, 1);
        }

        let neoAmount = Number(this.quickSarModal.neoAmount);
        if (isNaN(neoAmount) || neoAmount <= 0) {
          let index = findIndex(tempArr, o => o.name === 'convert');
          tempArr.splice(index, 1);
          let index1 = findIndex(tempArr, o => o.name === 'mortgage');
          tempArr.splice(index1, 1);
        }

        //sdusd amount <=0
        let sdusdAmount = Number(this.quickSarModal.sdusdAmount);
        if (isNaN(sdusdAmount) || sdusdAmount <= 0) {
          let index = findIndex(tempArr, o => o.name === 'mint');
          tempArr.splice(index, 1);
        }
        return tempArr;
      },
      async quickSar() {
        if (this.btnLocked) {
          return;
        }
        this.btnLocked = true;

        const loading = this.$loading(LOADING_OPTION);
        let {wif, address} = this.currentUser;
        let _this = this;

        let payfee = this.gasFee ? '0.001' : false;

        if (!this.mySar) {
          await createSar(wif, address);
        } else {
          await neoToSneo(wif, address);
        }

        //创建sar
        async function createSar(wif, address) {
          let scAddr = _this.sarAddr.sarC.hash;
          let type = 'openSAR4C';
          let params = [
            "(addr)" + address,
            "(str)" + 'sneo_price'
          ];
          //签名
          let utxo = await getUtxo([address]);
          let tempObj = {
            wif,
            scAddr,
            utxos: utxo.result ? utxo.result : null,
            type,
            params,
          };
          let r = await _this.getSignature("callc", tempObj, payfee, loading);
          if (!r) {
            loading.close();
            _this.btnLocked = false;
            return;
          }
          //广播
          let draw = await sendDrawTransaction([r.rawData]);
          if (!draw.result || !draw.result[0].sendrawtransactionresult) {
            _this.$message.error('Create SAR Failed');
            loading.close();
            _this.btnLocked = false;
            return;
          }


          _this.checkTxid(r, draw, () => {
            _this.activeStep++; // change step status
            neoToSneo(wif, address);
          });
        }

        //neo转sneo
        async function neoToSneo(wif, address) {
          let amount = parseInt(_this.quickSarModal.neoAmount);
          if (amount <= 0) {
            addSneo(wif, address);
            return;
          }

          let scHash = _this.sarAddr.sneo.hash;
          let scAddr = ThinNeo.Helper.GetAddressFromScriptHash(eNeo.endianChange(scHash).hexToBytes());
          let utxo = await getUtxo([address]);
          if (!utxo.result) {
            return;
          }
          if (!amount) return;
          let globalCoinParams = {
            assertId: 'neo',
            amount: amount,
            toAddr: scAddr,
            utxos: utxo.result ? utxo.result : null,
          };
          let callParams = {
            scHash,
            method: "mintTokens",
            params: ["(str)neo"]
          };

          //签名
          let tempObj = {
            wif,
            globalCoinParams,
            callParams,
          };
          let r = await _this.getSignature("callc2", tempObj, payfee, loading);
          if (!r) {
            updateQuickSarStatus();
            return;
          }

          let draw = await sendDrawTransaction([r.rawData]);

          //error info
          if (!draw.result || !draw.result[0].sendrawtransactionresult) {
            _this.$message.error('Convert SNEO Failed');
            return;
          }

          _this.checkTxid(r, draw, () => {
            _this.activeStep++; // change step status
            addSneo(wif, address);
          });
        }

        //增加sneo
        async function addSneo(wif, address) {
          if (Number(_this.quickSarModal.neoAmount) <= 0) {
            issueSdusd(wif, address);
            return;
          }
          let scAddr = _this.sarAddr.sarC.hash;
          let amount = new BN(_this.quickSarModal.neoAmount).times(EIGHT_POWER)
            .integerValue().toString();
          let params = [
            "(addr)" + address,
            "(int)" + amount,
          ];
          let utxo = await getUtxo([address]);

          //签名
          let tempObj = {
            wif,
            scAddr,
            utxos: utxo.result ? utxo.result : null,
            type: 'reserve',
            params,
          };
          let r = await _this.getSignature("callc", tempObj, payfee, loading);
          if (!r) {
            updateQuickSarStatus();
            return;
          }

          let draw = await sendDrawTransaction([r.rawData]);

          //error info
          if (!draw.result || !draw.result[0].sendrawtransactionresult) {
            _this.$message.error('Mortgage SNEO Failed');
            updateQuickSarStatus();
            return;
          }

          _this.checkTxid(r, draw, () => {
            _this.activeStep++; // change step status
            issueSdusd(wif, address)
          });
        }

        //发行sdusd
        async function issueSdusd(wif, address) {
          if (Number(_this.quickSarModal.sdusdAmount <= 0)) {
            updateQuickSarStatus();
            return;
          }

          let scAddr = _this.sarAddr.sarC.hash;
          let amount = new BN(_this.quickSarModal.sdusdAmount).times(EIGHT_POWER)
            .integerValue().toString();
          let params = [
            "(addr)" + address,
            "(int)" + amount,
          ];
          let utxo = await getUtxo([address]);


          let tempObj = {
            wif,
            scAddr,
            utxos: utxo.result ? utxo.result : null,
            type: 'expande',
            params,
          };
          let r = await _this.getSignature("callc", tempObj, payfee, loading);
          if (!r) {
            updateQuickSarStatus();
            return;
          }

          let draw = await sendDrawTransaction([r.rawData]);

          //error info
          if (!draw.result || !draw.result[0].sendrawtransactionresult) {
            _this.$message.error('Mint SDUSD Failed');
            updateQuickSarStatus();
            return;
          }

          await _this.checkTxid(r, draw, () => {
            _this.activeStep++; // change step status
            updateQuickSarStatus();
            loading.close();
          });
        }

        //更新状态
        function updateQuickSarStatus() {
          _this.btnLocked = false;
          _this.quickSarModal.show = false;
          _this.activeStep = 0;
          _this.updateViewData();
          loading.close();
        }
      },

      //sar操作历史记录
      async getHistoryDetail() {
        let params = [this.mySar.txid, 100, 1];
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
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/var";

  .create-btn {
    margin: 45px 0;
    padding: 12px 25px;
    font-size: 18px;
  }

  .quick-sar-btn {
    float: right;
    height: 32px;
    line-height: 32px;
    padding: 0 10px !important;
    margin-right: 19px;
    min-width: 110px;
  }

  .quick-sar-info {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
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

  .quick-sar-modal {
    .el-dialog {
      margin-top: 80px !important;

      &__body {
        padding: 0 !important;
      }
    }

    .quick-sar-steps {
      padding: 10px 25px;
      background: #F6F6F9;

      .el-step__icon {
        width: 20px;
        height: 20px;
        font-size: 12px;
      }

      .el-step__title {
        font-size: 12px;
        line-height: 16px;
        margin-top: 10px;
      }

      .el-step.is-horizontal .el-step__line {
        top: 9px;
        height: 1px;
      }
    }

    .quick-sar-content {
      padding: 0 25px;
      margin-top: -10px;

      .el-form {
        &-item {
          margin-bottom: 6px !important;
        }
      }
    }
  }
</style>

