<template>
  <el-card class="border-card">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">{{$t('institution.mySar')}}</span>
    </div>
    <div class="align-center" v-if="!mySar">
      <el-button class="create-btn"
                 type="primary"
                 :disabled="createSarBtn"
                 @click="createModal=true">{{$t('institution.createSar')}}
      </el-button>
    </div>
    <el-table v-if="mySar" class="no-border-table cell-first-highlight"
              stripe :data="mySar" style="width: 100%">
      <el-table-column prop="symbol"
                       :label="$t('institution.name')"
                       width="120"></el-table-column>
      <el-table-column prop="anchorType"
                       :label="$t('institution.type')"
                       width="80">
        <template slot-scope="scope">
          <span>{{scope.row.anchorType | filterMethod($t('anchorTypes'))}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sarHasDrawed"
                       :label="$t('institution.circulation')"
                       align="right"
                       min-width="160">
        <template slot-scope="scope">
          <div>{{scope.row.sarHasDrawedShow | numFormat}}</div>
          <div class="coin-val">(${{scope.row.sarHasDrawedTranUsd | numFormat}})</div>
        </template>
      </el-table-column>
      <el-table-column prop="sarLocked"
                       :label="$t('institution.sdsMargin')"
                       align="right"
                       min-width="200">
        <template slot-scope="scope">
          <div>{{scope.row.sarLockedShow | numFormat}}</div>
          <div class="coin-val">(${{scope.row.sarLockedTranUsd | numFormat}})</div>
        </template>
      </el-table-column>
      <el-table-column prop="ratioAvailShow"
                       :label="$t('institution.marginRate')"
                       align="right"
                       min-width="120">
        <template slot-scope="scope">
          {{scope.row.ratioAvailShow | numFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="status"
                       align="center"
                       :label="$t('institution.status')"
                       width="100">
        <template slot-scope="scope">
          <span v-if="isInitBtnShow">--</span>
          <span v-else
                :class="[{'blue':Number(scope.row.status)===1,
                          'red':Number(scope.row.status)===2,
                          'yellow':Number(scope.row.status)===3,}]">
             {{scope.row.status | filterMethod($t('sarBStatus'))}}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('institution.operation')"
                       width="320">
        <template slot-scope="scope">
          <div>
            <el-button type="primary"
                       plain
                       class="middle-btn"
                       :disabled="expandBtn"
                       @click="opSarShow('expande',$t('institution.issue'))">
              {{$t('institution.issue')}}
            </el-button>
            <el-button type="primary"
                       plain
                       class="middle-btn"
                       :disabled="contractBtn"
                       @click="opSarShow('contract',$t('institution.reture'))">
              {{$t('institution.reture')}}
            </el-button>
            <el-button type="primary"
                       plain
                       class="middle-btn"
                       v-if="isInitBtnShow"
                       @click="initTokenModal = true">
              {{$t('institution.startSar')}}
            </el-button>
            <el-button type="primary"
                       plain
                       class="middle-btn"
                       v-else
                       :disabled="closeSarBtn"
                       @click="closeModal = true">
              {{$t('institution.closeSar')}}
            </el-button>
          </div>
          <div class="mt-10">
            <el-button type="primary"
                       plain
                       class="middle-btn"
                       :disabled="reserveBtn"
                       :style="{fontSize:$i18n.locale==='en'?'12px':'14px'}"
                       @click="opSarShow('reserve',$t('institution.increaseMargin'))">
              {{$t('institution.increaseMargin')}}
            </el-button>
            <el-button type="primary"
                       plain
                       class="middle-btn"
                       :disabled="withdrawBtn"
                       :style="{fontSize:$i18n.locale==='en'?'12px':'14px'}"
                       @click="opSarShow('withdraw',$t('institution.drawMargin'))">
              {{$t('institution.drawMargin')}}
            </el-button>
            <el-button type="primary"
                       plain
                       class="middle-btn"
                       @click="getHistoryDetail">{{$t('institution.history')}}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!--create sar dialog-->
    <el-dialog class="sar-modal"
               :title="$t('institution.createCoin.modalTitle')"
               label-position="top"
               center
               :show-close="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="createModal">
      <el-form :model="createForm" :rules="createRules" ref="createForm">
        <el-form-item prop="name" :label="$t('institution.createCoin.name')">
          <el-input class="sar-prepend-input"
                    :placeholder="$t('institution.createCoin.namePhl')"
                    v-model="createForm.name">
            <span slot="prefix" class="sar-modal-prefix">SD-</span>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('institution.createCoin.type')">
          <el-select v-model="createForm.type"
                     :placeholder="$t('institution.createCoin.typePhl')"
                     style="width: 100%;">
            <el-option v-for="item in $t('anchorTypes')"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button class="sar-modal-btn" @click="createModal = false">
          {{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn"
                   :disabled="createConfirmBtn"
                   type="primary"
                   @click="createSar">
          {{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--operation sar dialog-->
    <el-dialog class="sar-modal"
               :title="operationModal.title"
               label-position="top"
               center
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :show-close="false"
               :visible.sync="operationModal.show">
      <el-form @submit.native.prevent>
        <el-form-item :label="operationModal.name" props="num">
          <el-input-number v-model="operationModal.amount"
                           :placeholder="$t('')"
                           controls-position="right"
                           :min="0"
                           :max="operationModal.max"
                           style="width: 100%"></el-input-number>
        </el-form-item>
        <el-slider v-model="operationModal.amount"
                   :step="0.00000001"
                   :min="0"
                   :max="operationModal.max"></el-slider>
      </el-form>
      <ul v-if="operationModal.type==='withdraw'"
          class="mt-20"
          v-html="$t('institution.drawMarginInfo')"
          style="line-height: 30px;color:#667">
      </ul>
      <div slot="footer">
        <el-button class="sar-modal-btn"
                   @click="operationModal.show = false">{{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn"
                   type="primary"
                   @click="opSar">{{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--init sar dialog-->
    <el-dialog class="sar-modal"
               :title="$t('institution.launchCoin.modalTitle')"
               label-position="top"
               center
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :show-close="false"
               :visible.sync="initTokenModal">
      <ul class="close-sar-info" v-html="$t('institution.launchCoin.info')"></ul>
      <div slot="footer">
        <el-button class="sar-modal-btn"
                   @click="initTokenModal = false">{{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn"
                   type="primary"
                   :disabled="initSarBtn"
                   @click="initToken">{{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--close sar dialog-->
    <el-dialog class="sar-modal"
               :title="$t('institution.closeSar')"
               label-position="top"
               center
               :show-close="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="closeModal">
      <ul class="close-sar-info" v-html="$t('institution.closeSarInfo')"></ul>
      <div slot="footer">
        <el-button class="sar-modal-btn"
                   @click="closeModal = false">{{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn"
                   type="primary"
                   :disabled="closeSarBtn"
                   @click="closeSar">{{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--history dialog-->
    <el-dialog class="sar-modal history-modal"
               :title="$t('global.history.sarOperationHistory')"
               width="1000px"
               label-position="top"
               center
               :show-close="true"
               stripe
               :visible.sync="historyModal">
      <history-detail v-if="historyList" :data="historyList" type="sarB"></history-detail>
    </el-dialog>
  </el-card>
</template>

<script>
  import {filterMethod, numFormat} from '../../filters'
  import {sendDrawTransaction} from '../../api/global'
  import sarAddr from '../../mixins/getSarAddr'
  import checkTxid from '../../mixins/checkTxid'
  import {find} from 'lodash'
  import {bigmath, formatPrecision, printNumber} from "../../utils/index";
  import {getSarBHistory} from '../../api/institution'
  import historyDetail from '../public/historyDetail'

  export default {
    name: 'SarB',
    props: {
      currentUser: {
        type: Object,
        required: true,
      },
      sarConfig: {
        type: Object,
        required: true,
      },
      sdsObj: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        mySar: null,
        wenObj: null,
        isInitBtnShow: true,
        initSarBtn: false,
        closeSarBtn: false,
        expandBtn: false,
        contractBtn: false,
        withdrawBtn: false,
        reserveBtn: false,
        createModal: false,
        createForm: {
          name: '',
          type: '',
        },
        createRules: {
          name: [
            {
              validator: this.validateName, trigger: 'blur',
            }
          ]
        },
        createSarBtn: true,
        createConfirmBtn: false,
        initTokenModal: false,
        operationModal: {
          show: false,
          title: '',
          name: '',
          desc: '',
          type: '',
          amount: 0,
          max: 100,
        },
        closeModal: false,
        historyModal: false,
        historyList: null,
        disabled: false,
      }
    },
    filters: {
      filterMethod,
      numFormat
    },
    mixins: [sarAddr, checkTxid],
    components: {
      historyDetail,
    },
    async mounted() {
      this.createForm.type = this.$t('anchorTypes')[0].value;

      let mySar = await this.$parent.getSarInfo(this.currentUser.address);
      this.createSarBtn = false;
      if (mySar) {
        this.mySar = [mySar];

        let tokenName = await this.$parent.getTokenName(mySar.name);
        this.isInitBtnShow = tokenName ? false : true;

        if (!this.sdsObj) {
          this.initSarBtn = true;
        } else {
          let sdsBalance = formatPrecision(
            printNumber(
              bigmath.chain(bigmath.bignumber(this.sdsObj.balance))
                .divide(bigmath.bignumber(bigmath.pow(10, 8)))
                .done()
            ));
          this.initSarBtn = Number(sdsBalance) < 10 ? true : false;
        }

        let sarLocked = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(mySar.sarLocked))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          )
        );
        if (Number(mySar.sarHasDrawed) === 0 && Number(sarLocked) === 10) {
          this.closeSarBtn = false;
        } else {
          this.closeSarBtn = true;
        }

        this.expandBtn = Number(mySar.wenCanDraw) <= 0 ? true : false;
        if (this.isInitBtnShow) {
          this.expandBtn = true;
        }

        let wenObj = await this.$parent.getNewBalance(mySar.name, mySar.owner);

        if (wenObj) {
          this.wenObj = wenObj;
          this.contractBtn = Number(this.wenObj.balance) <= 0 ? true : false;
        }

        this.reserveBtn = Number(this.sdsObj.balance) <= 0 ? true : false;

        this.withdrawBtn = Number(mySar.availSdsCanfree) <= 0 ? true : false;
      }
    },
    methods: {
      async validateName(rule, value, callback) {
        let isExist = await this.$parent.getTokenName(`SD-${value}`);
        let locale = this.$i18n.locale;

        if (!value || !/^[A-Z]{3,5}$/.test(value)) {
          callback(new Error(locale === 'en' ? 'Suffix 3-5 capital' : '限3-5个大写字母'));
        } else if (isExist) {
          callback(new Error(locale === 'en' ? 'Name Taken' : '名称已被占用'));
        } else {
          callback();
        }
      },

      async createSar() {
        this.$refs['createForm'].validate((valid) => {
          if (valid) {
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
            this.createConfirmBtn = true;
            this.createSarBtn = true;

            let scAddr = this.sarAddr.sarB.hash;
            let {wif, address} = this.currentUser;
            let name = this.createForm.name;
            let symbol = `SD-${this.createForm.name}`;
            let type = this.createForm.type;
            let method = 'openSAR4B';

            let params = [
              "(str)" + name,    //name
              "(str)" + symbol,  //symbol
              "(int)8",          //decimals
              "(addr)" + address,//address
              "(str)" + type,    //anchorType
            ];

            let r = eNeo.callC(wif, scAddr, method, params);

            sendDrawTransaction([r.rawData]).then(draw => {
              this.checkTxid(r, draw, () => {
                this.createConfirmBtn = false;
                this.createModal = false;
                loading.close();
                location.reload();
              });
            }).catch(() => {
              loading.close();
              this.createConfirmBtn = false;
              this.createSarBtn = false;
              this.createModal = false;
              this.disabled = false;
            });
          } else {
            return false;
          }
        });
      },
      initToken() {
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
        let params = [
          "(addr)" + address
        ];

        let r = eNeo.callC(wif, scAddr, 'initToken', params);

        sendDrawTransaction([r.rawData]).then(draw => {
          this.checkTxid(r, draw, () => {
            loading.close();
            location.reload();
          });
        }).catch(() => {
          this.initTokenModal = false;
          this.disabled = false;
        });
      },

      opSarShow(type, title) {
        this.operationModal.show = true;
        this.operationModal.title = title;
        this.operationModal.type = type;
        let mySar = this.mySar[0];
        let opSarMax = 0;
        switch (type) {
          case 'expande':
            this.operationModal.name = this.mySar[0].name;
            opSarMax = mySar.wenCanDraw;
            break;
          case 'contract':
            this.operationModal.name = this.mySar[0].name;
            let wenBalance = formatPrecision(
              printNumber(
                bigmath.chain(bigmath.bignumber(this.wenObj.balance))
                  .divide(bigmath.bignumber(bigmath.pow(10, 8)))
                  .done()
              )
            );
            opSarMax = wenBalance || 0;
            break;
          case 'reserve':
            this.operationModal.name = 'SDS';
            let sdsBalance = formatPrecision(
              printNumber(
                bigmath.chain(bigmath.bignumber(this.sdsObj.balance))
                  .divide(bigmath.bignumber(bigmath.pow(10, 8)))
                  .done()
              )
            );
            opSarMax = sdsBalance || 0;
            break;
          case 'withdraw':
            this.operationModal.name = 'SDS';
            opSarMax = mySar.availSdsCanfree || 0;
        }
        opSarMax = +opSarMax;
        this.operationModal.amount = opSarMax;
        this.operationModal.max = opSarMax;
      },
      async opSar() {
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

        let scAddr = this.sarAddr.sarB.hash;
        let {wif, address} = this.currentUser;
        let {type, amount} = this.operationModal;
        amount = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(amount))
              .multiply(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 0
        );
        let name = this.mySar[0].name;
        let params = [
          "(str)" + name,
          "(addr)" + address,
          "(int)" + amount,
        ];

        let r = await eNeo.callC(wif, scAddr, type, params);

        sendDrawTransaction([r.rawData]).then(draw => {
          this.checkTxid(r, draw, () => {
            loading.close();
            location.reload();
          });
        }).catch(err => {
          this.operationModal.show = false;
          this.disabled = false;
        });
      },

      closeSar() {
        if (this.disabled) {
          return;
        }
        this.disabled = true;
        this.closeSarBtn = true;
        const loading = this.$loading({
          lock: true,
          text: '',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let scAddr = this.sarAddr.sarB.hash;
        let {wif, address} = this.currentUser;
        let method = 'destory';

        let params = [
          "(str)" + this.mySar[0].name,
          "(addr)" + address,
        ];

        let r = eNeo.callC(wif, scAddr, method, params);

        sendDrawTransaction([r.rawData]).then(draw => {
          this.checkTxid(r, draw, () => {
            loading.close();
            location.reload();
          });
        }).catch(() => {
          this.disabled = false;
        });
      },

      //history detail
      async getHistoryDetail() {
        let params = [this.mySar[0].sarTxid, this.mySar[0].owner, 10000, 1];
        let historyList = await getSarBHistory(params);
        if (historyList.result) {
          this.historyList = historyList.result;
        } else {
          this.historyList = [];
        }
        this.historyModal = true;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .create-btn {
    margin: 40px 0 20px;
    padding: 12px 25px;
    font-size: 18px;
  }

  .coin-val {
    color: #9999AA;
  }

  .close-sar-info {
    margin-top: 60px;
    line-height: 32px;
  }
</style>

