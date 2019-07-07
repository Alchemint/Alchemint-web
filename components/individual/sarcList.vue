<template>
  <el-card class="border-card">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">{{$t('individual.sarCList.title')}}</span>
      <div class="fr">
        <el-button type="primary"
                   :class="{'btn-primary':activeTab==='1'}"
                   plain
                   @click="getAllSarCList"
                   :disabled="loading"
                   size="small">{{$t('individual.sarCList.all')}}
        </el-button>
        <el-button type="primary"
                   :class="{'btn-primary':activeTab==='2'}"
                   plain
                   size="small"
                   :disabled="loading"
                   @click="activeTab='2';currentPage=1;getSarByFilterRate(1,150,1)">1-150%
        </el-button>
        <el-button type="primary"
                   plain
                   :class="{'btn-primary':activeTab==='3'}"
                   size="small"
                   :disabled="loading"
                   @click="activeTab='3';currentPage=1;getSarByFilterRate(150,200,1)">150-200%
        </el-button>
        <el-input style="width: 70px;margin-left: 10px"
                  size="small"
                  v-model="rateFrom">
          <div slot="suffix" style="text-align: center;line-height: 32px">%</div>
        </el-input>
        <span style="color: #9999aa;font-weight: 400;font-size: 14px">-</span>
        <el-input style="width: 70px"
                  size="small"
                  v-model="rateTo">
          <div slot="suffix" style="text-align: center;line-height: 32px">%</div>
        </el-input>
        <el-button style="margin-left: 10px"
                   type="primary"
                   :class="{'btn-primary':activeTab==='4'}"
                   size="small"
                   :disabled="!(rateFrom && rateTo) && loading"
                   @click="activeTab='4';currentPage=1;getSarByFilterRate(rateFrom,rateTo,1)">
          {{$t('individual.sarCList.filter')}}
        </el-button>
      </div>
    </div>
    <div v-loading="loading"
         :element-loading-text="$t('global.loading')"
         element-loading-spinner="el-icon-loading">
      <!--列表详情-->
      <el-table class="no-border-table empty-img-table"
                stripe
                :data="sarCList"
                :row-class-name="setRowStyle"
                style="width: 100%">
        <div slot="empty" class="no-data">
          <img class="img" src="~/assets/img/noData.png" alt="">
          <div class="txt">{{$t('global.noData')}}</div>
        </div>
        <el-table-column prop="id"
                         label="ID"
                         width="60"></el-table-column>
        <el-table-column prop="hasDrawed"
                         :label="$t('individual.sarCList.sdusdIssued')"
                         align="right"
                         width="120">
          <template slot-scope="scope">
          <span :title="setDp(scope.row.hasDrawed)">
            {{scope.row.hasDrawed | decimalPlaces(2)}}
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="remainDrawed"
                         :label="$t('individual.sarCList.sdusdRemained')"
                         align="right"
                         min-width="120">
          <template slot-scope="scope">
          <span :title="setDp(scope.row.remainDrawed)">
            {{scope.row.remainDrawed | decimalPlaces(2)}}
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="locked"
                         :label="$t('individual.sarCList.sneoCollateralized')"
                         align="right"
                         min-width="150">
          <template slot-scope="scope">
          <span :title="setDp(scope.row.locked)">
            {{scope.row.locked | decimalPlaces(2)}}
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="remainDrawedNEO"
                         :label="$t('individual.sarCList.sneoDrawable')"
                         align="right"
                         min-width="130">
          <template slot-scope="scope">
          <span :title="setDp(scope.row.remainDrawedNEO)">
            {{scope.row.remainDrawedNEO | decimalPlaces(2)}}
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="mortgageRate"
                         :label="$t('individual.sarCList.mortageRate')"
                         align="right"
                         min-width="140">
          <template slot-scope="scope">
            {{scope.row.mortgageRate | decimalPlaces(2)}}%
          </template>
        </el-table-column>
        <el-table-column prop="liqPrice"
                         :label="$t('individual.sarCList.liquidationPrice')"
                         align="center"
                         width="160">
          <template slot-scope="scope">
          <span :title="setDp(scope.row.liqPrice)">
            {{scope.row.liqPrice | decimalPlaces(2)}}
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="status"
                         :label="$t('individual.sarCList.status')"
                         align="center"
                         width="96">
          <template slot-scope="scope">
          <span :class="[{'green':scope.row.status==='0',
                         'blue':scope.row.status==='1',
                         'yellow':scope.row.status==='2',
                         'red':scope.row.status==='3'}]">
            {{scope.row.status | filterMethod($t('sarCStatus'))}}
          </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('individual.sarCList.history')"
                         min-width="76">
          <template slot-scope="scope">
            <el-button type="primary"
                       class="small-btn"
                       align="center"
                       plain
                       @click="getHistoryDetail(scope.row)">{{$t('individual.sarCList.history')}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('individual.sarCList.liquidate')"
                         :render-header="renderHeader"
                         align="center"
                         width="98" v-if="currentUser">
          <template slot-scope="scope"
                    v-if="scope.row.status==='3' && currentUser.address!==scope.row.owner && $parent.hasMySar">
            <el-button type="danger"
                       plain
                       class="small-btn"
                       :disabled="scope.row.status!=='3' || currentUser.address===scope.row.addr"
                       @click="opLiquidationModal(scope.row)">{{$t('global.liquidate')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="pagination-container clearfix" v-if="totalPage>0">
        <el-pagination background
                       layout="prev, pager, next"
                       :page-size='perPageNum'
                       :current-page="currentPage"
                       @current-change="handleCurrentChange"
                       :total="totalPage"></el-pagination>
        <div class="pagination-number">
          <span style="margin-right: 10px">{{$t('global.perPageNum')}}</span>
          <el-select v-model="perPageNum" size="small" style="width: 100px">
            <el-option v-for="item in perPageNumList"
                       :label="item+' '+$t('global.row')"
                       :value="item"
                       :key="item"></el-option>
          </el-select>
        </div>
      </div>
    </div>

    <!--历史记录模态框-->
    <el-dialog class="sar-modal history-modal"
               :title="$t('global.history.sarOperationHistory')"
               width="1000px"
               label-position="top"
               center
               :show-close="true"
               :lock-scroll="false"
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
        <el-form-item :label="$t('individual.liquidateModal.sdusdAmount')" class="fl" prop="sdusd">
          <div>
            <el-input v-model.number="liquidationForm.sdusd"
                      size="small"
                      v-if="currentSar"
                      :disabled="parseFloat(currentSar.mortgageRate)<=100"
                      style="width: 130px"
                      @change="handleSDUSDChange"></el-input>
            <i class="el-icon-caret-right"></i>
          </div>
          <div class="form-value">{{$t('individual.liquidateModal.value')}}：${{liquidationForm.sdusdV}}</div>
        </el-form-item>
        <el-form-item :label="$t('individual.liquidateModal.sneoAmount')" class="fl">
          <el-input v-model.number="liquidationForm.sneo"
                    disabled
                    size="small"
                    style="width: 130px"></el-input>
          <div class="form-value">
            {{$t('individual.liquidateModal.value')}}：${{liquidationForm.sneoV}}
          </div>
        </el-form-item>
      </el-form>
      <div>
        <div class="liquidated-info mt-30 clearfix">
          <span class="fl">{{$t('individual.liquidateModal.afterLiq')}}</span>
          <span class="fr">{{liquidationForm.rate | decimalPlaces(2)}}%</span>
        </div>
        <div class="liquidated-info mt-20 clearfix">
          <span class="fl">{{$t('individual.liquidateModal.afterStatus')}}
            <status-tooltip :type-a="typeA"></status-tooltip>
          </span>
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

    <!--硬件钱包模态框-->
    <cold-wallet-dialog :cold-wallet-dialog-visible="coldWalletDialogVisible"></cold-wallet-dialog>
  </el-card>
</template>

<script>
  import {filter, find, forEach} from 'lodash'
  import {getSarCCount, getSarCHistory, getsar4CDetailList, processSARFilterByRate} from '~/api/individual'
  import sarAddr from "~/mixins/getSarAddr";
  import {filterMethod, filterTime, decimalPlaces} from '~/filters/core'
  import {sendDrawTransaction, getUtxo} from '~/api/global'
  import checkTxid from '~/mixins/checkTxid'
  import historyDetail from '../public/historyDetail'
  import statusTooltip from './statusTooltip'
  import getLeaderPubkey from '~/mixins/getLeaderPubkey'
  import {mapGetters} from 'vuex'
  import {setDp, BN} from '~/utils/core'
  import {EIGHT_POWER, LOADING_OPTION} from "~/filters/const";
  import sarC from '~/mixins/sarC'

  export default {
    name: 'SarCList',
    props: {
      currentUser: {},
      assets: {},
    },
    data() {
      return {
        sarCList: null,
        currentSar: null,
        liquidationModal: false,
        historyModal: false,
        historyList: null,
        totalPage: 0,
        perPageNumList: [10, 20, 30, 50, 100],
        perPageNum: 10,
        currentPage: 0,
        loading: true,
        liquidationForm: {
          sdusd: '',
          sdusdV: '',
          sneo: '',
          sneoV: '',
          rate: '',
          status: '0',
          cir_discount_rate: '', //折扣率
        },
        rules: {
          sdusd: [
            {
              required: true, validator: this.validatorSDUSD, trigger: 'blur'
            },
          ],
        },
        btnLocked: false,
        rateFrom: '',
        rateTo: '',
        activeTab: '1', //1为全部，2为1-150%，3为150-200，4为其他区间
        sarCListTotal: null, //筛选抵押率百分比，后端无法做分页,
        rangeRate: [],
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
    filters: {
      filterMethod,
      filterTime,
      filterTxid(val) {
        return val.slice(0, 4) + "..." + val.substr(val.length - 4);
      },
      decimalPlaces
    },
    components: {
      historyDetail,
      statusTooltip
    },
    async mounted() {
      if (!this.typeB) {
        await this.$store.dispatch('getTypeB');
      }
      if (!this.typeA) {
        await this.$store.dispatch('getTypeA');
      }
      this.getSarCList(1);
      this.getPageCount();
    },
    methods: {
      setDp,
      getSarByFilterRate(from, to, currentPage) {
        this.loading = true;
        this.totalPage = 0;
        this.currentPage = currentPage;
        this.rangeRate = [from, to];
        processSARFilterByRate([from, to]).then(res => {
          if (res.result) {
            let sarCList = res.result;
            forEach(sarCList, (item, index) => {
              item.id = index + 1;
              item.status = this.getSarCStatus(item.locked, item.hasDrawed, item.mortgageRate, this.lineRateC);
            });
            this.totalPage = sarCList.length;
            this.sarCListTotal = sarCList;
            let startId = (this.currentPage - 1) * this.perPageNum;
            let endId = this.currentPage * this.perPageNum;
            this.sarCList = sarCList.slice(startId, endId);
          } else {
            this.sarCList = null;
          }
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      },
      getAllSarCList() {
        this.loading = true;
        this.activeTab = '1';
        this.currentPage = 1;
        this.getSarCList(1);
        this.getPageCount();
      },
      renderHeader(h, {column, $index}) {
        return h('span', {}, [
          h('span', {}, this.$t('individual.sarCList.liquidate')),
          h('el-popover', {
            props: {
              placement: 'bottom-end',
              trigger: 'hover',
              width: 370,
              popperClass: 'liquidate-popper',
            },
          }, [
            h('ul', {
              domProps: {
                innerHTML: this.$t('individual.liquidateModal.info', {
                  'lineRate': this.lineRateC,
                  'topRate': this.lineRateC + 50,
                })
              },
              class: 'tooltip-ul',
            },),
            h('icon-font', {
              slot: 'reference',
              class: 'green',
              style: {
                marginLeft: '2px',
                outline: 0,
                cursor: 'pointer',
                fontWeight: 'normal'
              },
              props: {
                name: 'icon-wenhao'
              }
            }, ''),
          ])
        ])

      },
      setRowStyle(row) {
        if (row.row.status === '3') {
          return 'red'
        }
      },

      //获取sarc列表
      async getSarCList(page) {
        let scAddr = this.sarAddr.sarC.hash;
        let params = [1, scAddr, this.perPageNum, page || 1];
        let _sarCList = await getsar4CDetailList(params);
        let sarCList = _sarCList.result;
        if (!sarCList) {
          this.loading = false;
          this.sarCList = null;
          return;
        }

        forEach(sarCList, (item, index) => {
          item.id = (index + 1) + (page - 1) * this.perPageNum;
          item.status = this.getSarCStatus(item.locked, item.hasDrawed, item.mortgageRate, this.lineRateC);
        });
        this.sarCList = sarCList;
        this.loading = false;
      },
      //获取sarC总条数
      async getPageCount() {
        let scAddr = this.sarAddr.sarC.hash;
        let params = [1, scAddr];
        let count = await getSarCCount(params);
        this.totalPage = parseInt(count.result[0].sar4ccount);
      },
      handleCurrentChange(val) {
        this.updateSarCList(val);
      },

      /** 清算
       *  cneo_price*(sarLocked - x*1/(cneo_price*liquidate_dis_rate_c))/sarHasDrawed - x
       *  = liquidate_top_rate_c/100
       */
      opLiquidationModal(item) {
        this.liquidationModal = true;
        this.currentSar = item;
        //获得折扣率
        this.liquidationForm.cir_discount_rate = this.getCirDiscountRate();
        //设置最大sdusdAmount
        this.liquidationForm.sdusd = this.getSDUSDMax();
        //获取清算表单数据
        this.getLiquidationFormVal();
      },
      getLiquidationFormVal() {
        let sneo_price = find(this.typeB, o => o.key === 'sneo_price').value;
        let lineRateC = find(this.typeA, o => o.key === 'liquidate_line_rate_c').value;
        let disRateC = this.liquidationForm.cir_discount_rate;
        let {locked, hasDrawed, mortgageRate} = this.currentSar;
        mortgageRate = parseFloat(mortgageRate);

        //sdusd数量
        let sdusdAmount = Number(this.liquidationForm.sdusd);

        //sneo数量
        let sneoAmount = 0;
        if (mortgageRate > 100) {
          sneoAmount = new BN(this.liquidationForm.sdusd).times(100)
            .div(sneo_price).div(disRateC).dp(8, 3).toNumber();
        } else {
          sneoAmount = Number(locked);
        }
        this.liquidationForm.sneo = sneoAmount;

        //sneo的价值
        let sdusdValue = new BN(sdusdAmount).dp(2, 3).toString();
        let sneoValue = new BN(this.liquidationForm.sneo).times(sneo_price).dp(2, 3).toString();
        this.liquidationForm.sdusdV = sdusdValue;
        this.liquidationForm.sneoV = sneoValue;

        //可清算Neo(增加判断)
        let canClearNeo;
        canClearNeo = Number(this.liquidationForm.sneo);

        if (canClearNeo > locked) {
          canClearNeo = locked;
        }

        //抵押率和状态
        let calcHasDrawed = new BN(hasDrawed).minus(sdusdAmount);
        let calcLocked = new BN(locked).minus(canClearNeo);
        let {rate, status} = this.getRateAndStatus(calcLocked, calcHasDrawed, sneo_price, this.lineRateC);
        this.liquidationForm.rate = rate;
        this.liquidationForm.status = status;
      },
      //校验sdusd数量
      validatorSDUSD(rule, value, callback) {
        let sdusdVal = find(this.assets, o => o.assetid === this.sarAddr.sdusd.hash);
        let balance = sdusdVal ? Number(sdusdVal.balance) : 0;
        let max = Number(this.getSDUSDMax());
        let locale = this.$i18n.locale;
        let decimals = new BN(+value).dp();
        if (!value) {
          return callback(new Error(locale === 'en' ? 'SDUSD quantity cannot be empty.' : 'SDUSD值不能为空'));
        } else if (!Number(value)) {
          return callback(new Error(locale === 'en' ? 'SDUSD value must be numeric.' : 'SDUSD值必须为数字'))
        } else if (value > max) {
          return callback(new Error(locale === 'en' ? `The maximum SDUSD that can be input is${max}` : `可投入的SDUSD最大值为${max}`));
        } else if (balance < value) {
          return callback(new Error(locale === 'en' ? `Insufficient SDUSD in your account. ` : `账户中的SDUSD不足以支付`));
        } else if (decimals > 8) {
          return callback(new Error(locale === 'en' ? `The number of decimal places cannot exceed 8 digits` : `小数位数不能超过8位`));
        } else {
          return callback();
        }
      },
      //获得最大可用sdusd
      getSDUSDMax() {
        let sneo_price = find(this.typeB, o => o.key === 'sneo_price').value;
        let lineTopRateC = find(this.typeA, o => o.key === 'liquidate_top_rate_c').value; //最大清算抵押率
        let disRate = this.liquidationForm.cir_discount_rate; //折扣率

        let {locked, hasDrawed, mortgageRate} = this.currentSar;

        //分子
        let molecule = new BN(
          new BN(lineTopRateC).div(100)
        ).minus(
          new BN(100).div(disRate)
        ).toNumber();

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
      handleSDUSDChange(val) {
        if (Number(val)) {
          let max = this.getSDUSDMax();
          this.liquidationForm.sdusd = this.liquidationForm.sdusd > max ? max : this.liquidationForm.sdusd;
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
        let amount = new BN(this.liquidationForm.sdusd).times(EIGHT_POWER).integerValue().toNumber();

        let scAddr = this.sarAddr.sarC.hash;
        let type = 'rescue';
        let params = [
          "(addr)" + this.currentSar.owner,
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
      getCirDiscountRate() {
        let disRateC = find(this.typeA, o => o.key === 'liquidate_dis_rate_c').value;
        let currentRate = parseFloat(this.currentSar.mortgageRate);
        currentRate = new BN(currentRate).div(100).toNumber();
        let cirDiscountRate = Math.ceil(100 / currentRate);
        return cirDiscountRate > disRateC ? cirDiscountRate : disRateC;
      },

      //更新数据
      updateViewData() {
        this.$emit('update-data');
      },

      //历史记录
      async getHistoryDetail(item) {
        let params = [item.txid, 100, 1];
        let _historyList = await getSarCHistory(params);
        let historyList = _historyList.result;
        if (historyList) {
          this.historyList = historyList;
        } else {
          this.historyList = [];
        }
        this.historyModal = true;
      },

      //更新SARC数据
      updateSarCList(val) {
        this.loading = true;
        this.currentPage = val || 1;
        switch (this.activeTab) {
          case '1':
            this.getSarCList(val);

            break;
          case '2':
          case '3':
          case '4':
            let startId = (this.currentPage - 1) * this.perPageNum;
            let endId = this.currentPage * this.perPageNum;
            this.sarCList = this.sarCListTotal.slice(startId, endId);
            this.loading = false;
            break;
        }
      }
    },
    watch: {
      perPageNum() {
        this.updateSarCList(1);
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/var";

  .create-btn {
    margin: 40px 0 20px;
    padding: 12px 25px;
    font-size: 18px;
  }

  .btn-primary {
    color: #fff !important;
    background: $--color-primary !important;
    border-color: $--color-primary !important;
  }

  .recover-modal-info {
    padding: 80px 0;
    text-align: center;
    line-height: 20px
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

<style lang="scss">
  @import "../../assets/styles/var";

  .liquidate-popper {
    border-color: $--color-primary;
    font-size: 12px !important;
    padding: 6px !important;

    .popper__arrow {
      filter: drop-shadow(0 2px 12px $--color-primary);
    }
  }

  .liquidate-popper[x-placement^="bottom"] .popper__arrow {
    border-bottom-color: $--color-primary;
  }
</style>
