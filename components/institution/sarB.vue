<template>
  <el-card class="border-card">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">{{$t('institution.mySar')}}</span>
    </div>
    <!--无SAR-B-->
    <div class="align-center" v-if="!mySar">
      <el-button class="create-btn"
                 type="primary"
                 :disabled="createBtn"
                 @click="validateCreateSar">{{$t('institution.createSar')}}
      </el-button>
    </div>

    <!--有SAR-B-->
    <el-table v-if="mySar"
              class="no-border-table cell-first-highlight"
              stripe
              :data="mySar"
              style="width: 100%">
      <el-table-column prop="symbol"
                       :label="$t('institution.name')"
                       width="120"></el-table-column>
      <el-table-column prop="anchor"
                       :label="$t('institution.type')"
                       width="80">
        <template slot-scope="scope">
          <span>{{scope.row.anchor | filterMethod($t('anchorTypes'))}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hasDrawed"
                       :label="$t('institution.circulation')"
                       align="right"
                       min-width="160">
        <template slot-scope="scope">
          <div :title="setDp(scope.row.hasDrawed)">
            {{scope.row.hasDrawed | decimalPlaces(2)}}
          </div>
          <div :title="setDp(scope.row.nep55Value)" class="coin-val">
            (${{scope.row.nep55Value | decimalPlaces(2)}})
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="locked"
                       :label="$t('institution.sdsMargin')"
                       align="right"
                       min-width="200">
        <template slot-scope="scope">
          <div :title="setDp(scope.row.locked)">
            {{scope.row.locked | decimalPlaces(2)}}
          </div>
          <div :title="setDp(scope.row.sdsValue)" class="coin-val">
            (${{scope.row.sdsValue | decimalPlaces(2)}})
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mortgageRate"
                       :label="$t('institution.marginRate')"
                       align="right"
                       min-width="120">
        <template slot-scope="scope">
          {{scope.row.mortgageRate | decimalPlaces(2)}}%
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
                       @click="opSarShow('expande',$t('institution.issue'))">
              {{$t('institution.issue')}}
            </el-button>
            <el-button type="primary"
                       plain
                       class="middle-btn"
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
                       @click="closeModal = true">
              {{$t('institution.closeSar')}}
            </el-button>
          </div>
          <div class="mt-10">
            <el-button type="primary"
                       plain
                       class="middle-btn"
                       :style="{fontSize:$i18n.locale==='en'?'12px':'14px'}"
                       @click="opSarShow('reserve',$t('institution.increaseMargin'))">
              {{$t('institution.increaseMargin')}}
            </el-button>
            <el-button type="primary"
                       plain
                       class="middle-btn"
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

    <!--创建sar模态框-->
    <el-dialog class="sar-modal"
               :title="$t('institution.createCoin.modalTitle')"
               label-position="top"
               center
               :show-close="false"
               :lock-scroll="false"
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
        <el-form-item :label="$t('global.fee')">
          <el-checkbox v-model="gasFee">{{$t('global.feeInfo')}}</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button class="sar-modal-btn" @click="createModal=false">
          {{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn"
                   type="primary"
                   @click="createSar">
          {{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--操作sar模态框-->
    <el-dialog class="sar-modal"
               :title="operationModal.title"
               label-position="top"
               center
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :show-close="false"
               :lock-scroll="false"
               :visible.sync="operationModal.show">
      <el-form @submit.native.prevent ref="operationSarB"
               :rules="operationRules" :model="operationModal">
        <el-form-item :label="operationModal.name" prop="amount">
          <el-input-number v-model="operationModal.amount"
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

    <!--initToken sar模态框-->
    <el-dialog class="sar-modal"
               :title="$t('institution.launchCoin.modalTitle')"
               label-position="top"
               @close="initTokenErr=''"
               center
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :show-close="false"
               :lock-scroll="false"
               :visible.sync="initTokenModal">
      <ul class="close-sar-info" v-html="$t('institution.launchCoin.info')"></ul>
      <div class="mt-30">
        <el-checkbox v-model="gasFee">{{$t('global.feeInfo')}}</el-checkbox>
      </div>
      <div class="init-token-err" v-if="initTokenErr">{{initTokenErr}}</div>
      <div slot="footer">
        <el-button class="sar-modal-btn"
                   @click="initTokenModal=false">{{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn"
                   type="primary"
                   @click="validateInitToken">{{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--关闭sar模态框-->
    <el-dialog class="sar-modal"
               :title="$t('institution.closeSar')"
               label-position="top"
               center
               :show-close="false"
               :lock-scroll="false"
               @close="closeErr=''"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="closeModal">
      <ul class="close-sar-info" v-html="$t('institution.closeSarInfo')"></ul>
      <div class="init-token-err" v-if="closeErr">{{closeErr}}</div>
      <el-checkbox class="mt-30" v-model="gasFee">{{$t('global.feeInfo')}}</el-checkbox>
      <div slot="footer">
        <el-button class="sar-modal-btn"
                   @click="closeModal=false">{{$t('global.cancelBtn')}}
        </el-button>
        <el-button class="sar-modal-btn"
                   type="primary"
                   @click="validateCloseSar">{{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--sar操作历史记录-->
    <el-dialog class="sar-modal"
               :title="$t('global.history.sarOperationHistory')"
               width="1000px"
               label-position="top"
               center
               :show-close="true"
               :lock-scroll="false"
               stripe
               :visible.sync="historyModal">
      <history-detail v-if="historyList" :data="historyList" type="sarB"></history-detail>
    </el-dialog>

    <!--硬件钱包签名提示-->
    <cold-wallet-dialog :cold-wallet-dialog-visible="coldWalletDialogVisible"></cold-wallet-dialog>
  </el-card>
</template>

<script>
  import {getCurrentUser} from '~/utils/login'
  import {getsar4BDetailByAdd, getSarBHistory} from '~/api/institution'
  import getSarAddr from '~/mixins/getSarAddr'
  import {sendDrawTransaction, getUtxo, invokeScript} from '~/api/global'
  import checkTxid from '~/mixins/checkTxid'
  import {filterMethod, decimalPlaces} from '~/filters/core'
  import getLeaderPubkey from '~/mixins/getLeaderPubkey'
  import {find} from 'lodash'
  import {BN, setDp} from "~/utils/core";
  import historyDetail from '~/components/public/historyDetail'
  import {LOADING_OPTION} from '../../filters/const'
  import {mapGetters} from 'vuex'
  import eNeo from '~/utils/eNeo'

  export default {
    name: 'SarB',
    props: {
      typeB: {
        type: Array,
        required: true,
      },
      assets: {}
    },
    data() {
      return {
        currentUser: null, //用户信息
        mySar: null, //Sar信息
        btnLocked: false,  //按钮锁定，避免多次弹框
        gasFee:false, //GAS手续费

        //创建sar信息
        createBtn: true, // 创建sar按钮disabled的状态
        createModal: false, //创建sar模态框
        createForm: { //创建sar表单
          name: '',
          type: '',
        },
        createRules: {
          name: [
            {
              validator: this.validateName, trigger: 'blur',
            }
          ]
        }, //创建sar表单验证

        //initTokenSar信息
        isInitBtnShow: true, //判断显示initToken还是closeSar
        initTokenModal: false, //initToken模态框
        initTokenErr: '', //无法启动sar,

        //操作sar(发行/回收稳定币，增加/回收保证金)
        operationModal: {
          show: false,
          title: '',
          name: '',
          desc: '',
          type: '',
          amount: 0,
          max: 100,
        },
        operationRules: {
          amount: [
            {
              validator: this.validateAmount, trigger: 'blur'
            }
          ],
        },

        //关闭sar
        closeModal: false,
        closeErr: '',

        //历史数据
        historyModal: false,
        historyList: null,
      }
    },
    computed: {
      ...mapGetters(['typeA'])
    },
    components: {
      historyDetail,
    },
    mixins: [getSarAddr, getLeaderPubkey, checkTxid],
    filters: {
      filterMethod,
      decimalPlaces,
    },
    async mounted() {
      //用户信息
      let user = getCurrentUser(this);
      this.currentUser = user;

      //未登录，启用create按钮
      if (!user) {
        this.createBtn = false;  //启用create sar按钮
        return;
      }

      //登录，获取Sar数据
      await this.getMySarInfo();
    },
    methods: {
      setDp,

      //获取mySar信息
      async getMySarInfo() {
        let _mySar = await getsar4BDetailByAdd([this.currentUser.address, this.sarAddr.sarB.hash]);
        let mySarArr = _mySar.result;
        if (!mySarArr) {
          this.createBtn = false;  //启用create sar按钮
          this.mySar = null;
          return;
        }

        let mySar = mySarArr[0];

        //数据处理
        //计算所需oracle配置参数
        let sds_price = find(this.typeB, o => o.key === 'sds_price').value;
        if (!this.typeA) {
          await this.$store.dispatch('getTypeA');
        }
        let lineRateB = find(this.typeA, o => o.key === 'liquidate_line_rate_b').value;
        let anchorPrice = find(this.typeB, o => o.key === mySar.anchor).value;

        //所有稳定币数量，可发行稳定币数量
        BN.config({DECIMAL_PLACES: 20});
        let allNep55Balance = new BN(mySar.locked).times(sds_price)
          .div(lineRateB).div(anchorPrice).times(100).dp(8).toString();
        let issueNep55Balance = new BN(allNep55Balance).minus(mySar.hasDrawed).dp(8, 3).toString();

        mySar.allNep55Balance = allNep55Balance > 0 ? allNep55Balance : 0;
        mySar.issueNep55Balance = issueNep55Balance > 0 ? issueNep55Balance : 0;

        //已发行保证金数量，可回收保证金数量
        let issueSdsBalance = new BN(mySar.hasDrawed).times(anchorPrice)
          .times(lineRateB).div(100).div(sds_price).dp(8, 3).toString();
        let returnSdsBalance = new BN(mySar.locked).minus(issueSdsBalance).minus(10).dp(8, 3).toString();

        mySar.issueSdsBalance = issueSdsBalance > 0 ? issueSdsBalance : 0;
        mySar.returnSdsBalance = returnSdsBalance > 0 ? returnSdsBalance : 0;

        //检查initToken按钮显示状态
        if (mySarArr) {
          let tokenName = await this.judgeNep55NameExist(mySarArr[0].name);
          this.isInitBtnShow = tokenName ? false : true;
        }

        //赋值
        this.mySar = mySarArr;
        this.createBtn = false;  //启用create sar按钮
      },

      //弹出create模态框
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
        this.createModal = true;
        this.createForm.type = this.$t('anchorTypes')[0].value;
      },

      //创建sar
      async createSar() {
        this.$refs['createForm'].validate(async (valid) => {
          if (valid) {
            //按钮锁定，避免二次弹框
            if (this.btnLocked) {
              return;
            }
            this.btnLocked = true;

            const loading = this.$loading(LOADING_OPTION);
            let {wif, address} = this.currentUser;

            //获取utxos
            let utxo = await getUtxo([address]);
            let payfee = this.gasFee ? '0.001' : false;

            //创建sar所需参数
            let scAddr = this.sarAddr.sarB.hash;
            let name = this.createForm.name;
            let symbol = `SD-${this.createForm.name}`;
            let type = this.createForm.type;
            let method = 'openSAR4B';
            let params = [
              "(str)" + name,      //name
              "(str)" + symbol,    //symbol
              "(int)8",            //decimals
              "(addr)" + address,  //address
              "(str)" + type,      //anchor
            ];

            //签名
            let tempObj = {
              wif,
              utxos: utxo.result ? utxo.result : null,
              scAddr,
              type: method,
              params,
            };

            this.getSignature("callc", tempObj, payfee, loading).then(r => {
              //签名失败
              if (!r) {
                loading.close();
                this.btnLocked = false;
                return;
              }
              //广播
              sendDrawTransaction([r.rawData]).then(draw => {
                //轮询查询是否写入区块
                this.checkTxid(r, draw, () => {
                  this.btnLocked = false;
                  this.createModal = false;
                  this.updateViewData();
                  loading.close();
                });
              }).catch(() => {
                this.createModal = false;
                this.btnLocked = false;
                loading.close();
              });
            })

          } else {
            return;
          }
        });
      },

      //验证sar名称
      async validateName(rule, value, callback) {
        let isExist = await this.judgeNep55NameExist(`SD-${value}`);
        let locale = this.$i18n.locale;

        if (!value || !/^[A-Z]{3,5}$/.test(value)) {
          callback(new Error(locale === 'en' ? 'Suffix 3-5 capital' : '限3-5个大写字母'));
        } else if (isExist) {
          callback(new Error(locale === 'en' ? 'Name Taken' : '名称已被占用'));
        } else {
          callback();
        }
      },

      //检验initToken是否可以弹框
      async validateInitToken() {
        let sdsBalance = this.assets.find(o => o.assetid === this.sarAddr.sds.hash).balance;
        if (sdsBalance >= 10) {
          this.initTokenModal = true;
          this.initTokenErr = '';
          await this.initToken();
          return;
        }

        let locale = this.$i18n.locale;
        this.initTokenErr = locale === 'zh' ? '提示：账户中SDS不足10个，无法启动SAR' : `Tip：Less than 10 SDS in the account, unable to start SAR`;
      },

      //initToken sar
      async initToken() {
        if (this.btnLocked) {
          return;
        }
        this.btnLocked = true;
        const loading = this.$loading(LOADING_OPTION);
        let {wif, address} = this.currentUser;

        //获取utxos
        let utxo = await getUtxo([address]);
        let payfee = this.gasFee ? '0.001' : false;

        let scAddr = this.sarAddr.sarB.hash;
        let params = [
          "(addr)" + address
        ];

        //签名
        let tempObj = {
          wif,
          scAddr,
          utxos: utxo.result ? utxo.result : null,
          type: 'initToken',
          params,
        };
        let r = await this.getSignature("callc", tempObj, payfee, loading);
        if (!r) {
          loading.close();
          this.btnLocked = false;
          return;
        }

        //广播
        sendDrawTransaction([r.rawData]).then(draw => {
          //轮询
          this.checkTxid(r, draw, () => {
            this.initTokenModal = false;
            this.btnLocked = false;
            this.updateViewData();
            loading.close();
          });
        }).catch(() => {
          this.initTokenModal = false;
          this.btnLocked = false;
          loading.close();
        });
      },

      //弹出操作模态框
      opSarShow(type, title) {
        this.operationModal.show = true;
        this.operationModal.title = title;
        this.operationModal.type = type;
        let mySar = this.mySar[0];
        let opSarMax = 0;
        switch (type) {
          case 'expande':
            this.operationModal.name = this.mySar[0].name;
            opSarMax = mySar.issueNep55Balance;
            break;
          case 'contract':
            this.operationModal.name = this.mySar[0].name;
            let nep55 = find(this.assets, o => o.symbol === this.mySar[0].name);
            let nep55Balance = nep55 ? nep55.balance : 0;
            opSarMax = nep55Balance || 0;
            break;
          case 'reserve':
            this.operationModal.name = 'SDS';
            let sdsBalance = find(this.assets, o => o.assetid === this.sarAddr.sds.hash).balance;
            opSarMax = sdsBalance || 0;
            break;
          case 'withdraw':
            this.operationModal.name = 'SDS';
            opSarMax = mySar.returnSdsBalance || 0;
        }
        opSarMax = +opSarMax;
        this.operationModal.amount = opSarMax;
        this.operationModal.max = opSarMax;
      },

      //检查amount
      validateAmount(rule, value, callback) {
        let locale = this.$i18n.locale;
        let decimals = new BN(value).dp();
        if (this.isInitBtnShow) {
          callback(new Error(locale === 'zh' ? '需要先启动sar' : 'SAR needs to be started first'));
        } else if (Number(value) <= 0) {
          callback(new Error(locale === 'zh' ? '输入值必须大于0' : 'The input value must be greater than 0'));
        } else if (isNaN(value)) {
          callback(new Error(locale === 'zh' ? '输入值必须大于0' : 'The input value must be greater than 0'));
        } else if (decimals > 8) {
          callback(new Error(locale === 'zh' ? '小数位数不能超过8位' : ' The number of decimal places cannot exceed 8 digits'));
        } else {
          callback();
        }
      },

      //判断是否可以发起请求
      validateOperationForm() {
        this.$refs['operationSarB'].validate((valid) => {
          if (valid) {
            this.opSar();
          } else {
            return false;
          }
        });
      },

      //重置operationModal的form表单
      resetOperationModal() {
        this.operationModal.show = false;
        this.$refs['operationSarB'].resetFields();
      },

      //操作sar(发行/回收稳定币，增加/回收保证金)
      async opSar() {
        if (this.btnLocked) {
          return;
        }
        this.btnLocked = true;

        let scAddr = this.sarAddr.sarB.hash;
        let {wif, address} = this.currentUser;
        let {type, amount} = this.operationModal;

        //获取utxos
        let utxo = await getUtxo([address]);
        let payfee = this.gasFee ? '0.001' : false;

        if (amount <= 0) {
          return;
        }
        const loading = this.$loading(LOADING_OPTION);

        amount = new BN(amount).times(Math.pow(10, 8)).integerValue().toString();

        let name = this.mySar[0].name;
        let params = [
          "(str)" + name,
          "(addr)" + address,
          "(int)" + amount,
        ];

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
            loading.close();
            this.operationModal.show = false;
            this.btnLocked = false;
            this.updateViewData();
          });
        }).catch(() => {
          this.operationModal.show = false;
          this.btnLocked = false;
        });
      },

      //检验是否可以关闭sar
      validateCloseSar() {
        let {locked, hasDrawed} = this.mySar[0];
        if (Number(locked) === 10 && Number(hasDrawed) === 0) {
          this.closeSar();
          return;
        }

        let locale = this.$i18n.locale;
        this.closeErr = locale === 'zh' ? `必须确保发行量为0，且保证金数量刚好为10` : `Must ensure that the issue amount is 0 and the margin amount is exactly 10`;
      },

      //关闭sar
      async closeSar() {
        if (this.btnLocked) {
          return;
        }
        this.btnLocked = true;
        const loading = this.$loading(LOADING_OPTION);
        let scAddr = this.sarAddr.sarB.hash;
        let {wif, address} = this.currentUser;
        let method = 'destory';

        let params = [
          "(str)" + this.mySar[0].name,    //name
          "(addr)" + address,              //address
        ];

        //获取utxos
        let utxo = await getUtxo([address]);
        let payfee = this.gasFee ? '0.001' : false;

        //签名
        let tempObj = {
          wif,
          scAddr,
          utxos: utxo.result ? utxo.result : null,
          type: method,
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
            loading.close();
            this.btnLocked = false;
            this.closeModal = false;
            this.updateViewData();
          });
        }).catch(() => {
          this.btnLocked = false;
          this.closeModal = false;
          loading.close();
        });
      },

      //轮询之后更新数据
      updateViewData() {
        //更新mySar
        this.getMySarInfo();

        //更新assets,资产价格,列表数据
        this.$emit('update-data');
      },

      //获得sar操作历史纪录详情
      async getHistoryDetail() {
        let params = [this.mySar[0].txid, this.mySar[0].owner, 10000, 1];
        let historyList = await getSarBHistory(params);
        if (historyList.result) {
          this.historyList = historyList.result;
        } else {
          this.historyList = [];
        }
        this.historyModal = true;
      },

      //检查这个SarB的名称是否已被占用了
      async judgeNep55NameExist(name) {
        let scAddr = this.sarAddr.newToken.hash;
        let params = [
          {
            param: ["(str)" + name],
            method: "name",
          }
        ];
        let scHash = eNeo.emitParams(scAddr, params);
        let _r = await invokeScript([scHash]);
        let r = _r.result[0].stack[0].value;
        if (!r) {
          return '';
        }
        let tokenName = eNeo.hex2String(r);
        return tokenName;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/var";

  .create-btn {
    margin: 40px 0 20px;
    padding: 12px 25px;
    font-size: 18px;
  }

  .coin-val {
    color: #9999AA;
  }

  .close-sar-info {
    //margin-top: 60px;
    line-height: 32px;
    margin: 50px 0 0 0;
    padding-left: 26px;
  }

  .init-token-err {
    margin-top: 20px;
    color: $--color-danger;
    font-size: 14px;
    /*font-weight: bold;*/
    padding-left: 26px;
  }
</style>

