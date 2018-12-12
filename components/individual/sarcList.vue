<template>
  <el-card class="border-card">
    <div slot="header" class="border-card-header">
      <span class="border-card-header__title">{{$t('individual.sarCList.title')}}</span>
    </div>
    <el-table class="no-border-table"
              v-loading="loading"
              :element-loading-text="$t('global.loading')"
              element-loading-spinner="el-icon-loading"
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
      <el-table-column prop="sarHasDrawedShow"
                       :label="$t('individual.sarCList.sdusdIssued')"
                       align="right"
                       width="120">
        <template slot-scope="scope">
          {{scope.row.sarHasDrawedShow | numFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="wenCanDrawShow"
                       :label="$t('individual.sarCList.sdusdRemained')"
                       align="right"
                       min-width="120">
        <template slot-scope="scope">
          {{scope.row.wenCanDrawShow | numFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="sarLockedShow"
                       :label="$t('individual.sarCList.sneoCollateralized')"
                       align="right"
                       min-width="150">
        <template slot-scope="scope">
          {{scope.row.sarLockedShow | numFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="availSdsCanfreeShow"
                       :label="$t('individual.sarCList.sneoDrawable')"
                       align="right"
                       min-width="130">
        <template slot-scope="scope">
          {{scope.row.availSdsCanfreeShow | numFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="ratioAvailShow"
                       :label="$t('individual.sarCList.mortageRate')"
                       align="right"
                       min-width="140">
        <template slot-scope="scope">
          {{scope.row.ratioAvailShow | numFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="liquidationPriceShow"
                       :label="$t('individual.sarCList.liquidationPrice')"
                       align="center"
                       width="160">
        <template slot-scope="scope">
          {{scope.row.liquidationPriceShow | numFormat}}
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
                  v-if="scope.row.status==='3' && currentUser.address!==scope.row.addr && $parent.hasMySar">
          <el-button type="danger"
                     plain
                     class="small-btn"
                     :disabled="scope.row.status!=='3' || currentUser.address===scope.row.addr"
                     @click="opSettleSar(scope.row)">{{$t('global.liquidate')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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


    <!--history dialog-->
    <el-dialog class="sar-modal history-modal"
               :title="$t('global.history.sarOperationHistory')"
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
        <el-form-item :label="$t('individual.liquidateModal.sdusdAmount')" class="fl" prop="SDUSD">
          <div>
            <el-input v-model.number="settleForm.SDUSD"
                      size="small"
                      v-if="currentSar"
                      :disabled="Number(currentSar.ratioAvail)<=1"
                      style="width: 130px"
                      @change="handleSDUSDChange"></el-input>
            <i class="el-icon-caret-right"></i>
          </div>
          <div class="form-tip">{{$t('individual.liquidateModal.value')}}：${{settleForm.SDUSDV}}</div>
        </el-form-item>
        <el-form-item :label="$t('individual.liquidateModal.sneoAmount')" class="fl">
          <el-input v-model.number="settleForm.SNEO"
                    disabled
                    size="small"
                    style="width: 130px"></el-input>
          <div class="form-tip" v-if="sarConfig">
            {{$t('individual.liquidateModal.value')}}：${{settleForm.SNEOV}}
          </div>
        </el-form-item>
      </el-form>
      <div>
        <div class="resuce-info mt-30 clearfix">
          <span class="fl">{{$t('individual.liquidateModal.afterLiq')}}</span>
          <span class="fr">{{settleForm.rateShow}}</span>
        </div>
        <div class="resuce-info mt-20 clearfix">
          <span class="fl">{{$t('individual.liquidateModal.afterStatus')}}
             <el-tooltip popper-class="global-popper"
                         placement="bottom-start"
                         offset="100"
                         effect="light">
              <ul slot="content" class="tooltip-ul" v-html="$t('individual.statusInfo')"></ul>
              <icon-font name="icon-wenhao" class="green"></icon-font>
            </el-tooltip>
          </span>
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
        <el-button class="sar-modal-btn" type="primary" :disabled="disabled" @click="settleSar">
          {{$t('global.confirmBtn')}}
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  import {filter, find} from 'lodash'
  import {getSarCCount, getSarCHistory, getSarCListByType} from '../../api/individual'
  import sarAddr from "../../mixins/getSarAddr";
  import {filterMethod, filterTime, numFormat} from '../../filters'
  import {bigmath, formatPrecision, printNumber} from '../../utils'
  import {sendDrawTransaction} from '../../api/global'
  import checkTxid from '../../mixins/checkTxid'
  import historyDetail from '../public/historyDetail'

  export default {
    name: 'SarcList',
    props: {
      currentUser: {},
      sarConfig: {
        type: Object,
        required: true
      },
      assets: {},
    },
    data() {
      return {
        sarCList: null,
        currentSar: null,
        settleModal: false,
        historyModal: false,
        historyList: null,
        settleForm: {
          SDUSD: '',
          SDUSDV: '',
          SNEO: '',
          SNEOV: '',
          rate: '',
          rateShow: '',
          status: '0',
          cir_discount_rate: '',
        },
        rules: {
          SDUSD: [
            {
              required: true, validator: this.validatorSDUSD, trigger: 'blur'
            }
          ],
        },
        totalPage: 0,
        perPageNumList: [10, 20, 30, 50, 100],
        perPageNum: 10,
        currentPage: 0,
        loading: true,
        disabled: false,
      }
    },
    mixins: [sarAddr, checkTxid],
    filters: {
      filterMethod,
      filterTime,
      filterTxid(val) {
        return val.slice(0, 4) + "..." + val.substr(val.length - 4);
      },
      numFormat
    },
    components: {
      historyDetail,
    },
    async mounted() {
      this.getSarCList(1);
      this.getPageCount();
    },
    methods: {
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
                innerHTML: this.$t('individual.liquidateModal.info')
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

      async getSarCList(page) {
        let scAddr = this.sarAddr.sarC.hash;
        let params = [1, scAddr, this.perPageNum, page || 1];
        let _sarCList = await getSarCListByType(params);
        let sarCList = _sarCList.result;
        if (!sarCList) {
          this.loading = false;
          return;
        }
        let tempArr = [];
        for (let i = 0, len = sarCList.length; i < len; i++) {
          let item = sarCList[i];
          if (item.status !== 1) continue;
          let tempObj = await this.$parent.getSarInfo(this.sarConfig, item.addr);
          if (!tempObj) {
            tempObj = {
              sarHasDrawed: '0',
              wenCanDraw: '0',
              sarLocked: '0',
              availSdsCanfree: '0',
              status: '0',
              addr: item.addr,
              sarTxid: item.sarTxid,
              availSdsCanfreeShow: '--',
              sarHasDrawedShow: '0.00',
              wenCanDrawShow: '0.00',
              sarLockedShow: '0.00',
              ratioAvailShow: '--',
            }
          }
          tempObj.id = (i + 1) + (page - 1) * this.perPageNum;
          tempArr.push(tempObj);
        }
        this.sarCList = tempArr;
        this.loading = false;
      },
      async getPageCount() {
        let scAddr = this.sarAddr.sarC.hash;
        let params = [1, scAddr];
        let count = await getSarCCount(params);
        this.totalPage = parseInt(count.result[0].sar4ccount);
      },
      handleCurrentChange(val) {
        this.loading = true;
        this.getSarCList(val);
        this.currentPage = val;
      },

      //liquidation
      opSettleSar(item) {
        this.settleModal = true;
        this.currentSar = item;
        this.settleForm.cir_discount_rate = this.getCirDiscountRate();
        this.settleForm.SDUSD = this.getSDUSDMax();
        this.getSettleFormVal();
      },
      getSettleFormVal() {
        let {sneo_price, liquidate_line_rate_c} = this.sarConfig;
        let {sarLocked, sarHasDrawed} = this.currentSar;
        let canClearNeo;

        //sdusd amount
        let mount = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(this.settleForm.SDUSD))
              .multiply(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 0
        );
        mount = +mount;

        //sneo amount
        this.settleForm.SNEO = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(this.settleForm.SDUSD))
              .multiply(bigmath.bignumber(100))
              .multiply(bigmath.bignumber(bigmath.pow(10, 8)))
              .divide(bigmath.bignumber(sneo_price))
              .divide(bigmath.bignumber(this.settleForm.cir_discount_rate))
              .done()
          )
        );

        //sneo value and sdusd value
        this.settleForm.SDUSDV = formatPrecision(this.settleForm.SDUSD, 2);
        this.settleForm.SNEOV = formatPrecision(
          printNumber(
            bigmath.chain(bigmath.bignumber(this.settleForm.SNEO))
              .multiply(bigmath.bignumber(sneo_price))
              .divide(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 2
        );

        //can clear sneo
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

        //rate
        let rate, rateShow;
        if (sarHasDrawed === mount) {
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
              ).multiply(
                bigmath.bignumber(100)
              ).done()
            )
          );
          rateShow = formatPrecision(rate, 2) + '%';
        }
        rate = +rate;
        this.settleForm.rate = rate;
        this.settleForm.rateShow = rateShow;

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

        if (sarLocked === 0 || sarHasDrawed === 0 || rate === 0) {
          status = '0';
        }
        this.settleForm.status = status;
      },
      validatorSDUSD(rule, value, callback) {
        let sdusdVal = find(this.assets, o => o.symbol === 'SDUSD');
        let balance = sdusdVal ? Number(sdusdVal.balance) : 0;
        let max = Number(this.getSDUSDMax());
        let locale = this.$i18n.locale;
        if (!value) {
          return callback(new Error(locale === 'en' ? 'SDUSD quantity cannot be empty.' : 'SDUSD值不能为空'));
        } else if (!Number(value)) {
          return callback(new Error(locale === 'en' ? 'SDUSD value must be numeric.' : 'SDUSD值必须为数字'))
        } else if (value > max) {
          return callback(new Error(locale === 'en' ? `The maximum SDUSD that can be input is${max}` : `可投入的SDUSD最大值为${max}`));
        } else if (balance < value) {
          return callback(new Error(locale === 'en' ? `Insufficient SDUSD in your account. ` : `账户中的SDUSD不足以支付`));
        } else {
          return callback();
        }
      },
      getSDUSDMax() {
        let {sneo_price, liquidate_top_rate_c} = this.sarConfig;
        let {sarLocked, sarHasDrawed} = this.currentSar;

        let molecule = bigmath.chain(
          bigmath.bignumber(
            bigmath.chain(bigmath.bignumber(liquidate_top_rate_c))
              .divide(bigmath.bignumber(100))
              .done()
          )
        ).subtract(
          bigmath.bignumber(
            bigmath.chain(bigmath.bignumber(100))
              .divide(bigmath.bignumber(this.settleForm.cir_discount_rate))
              .done()
          )
        ).done();

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
      handleSDUSDChange(val) {
        if (Number(val)) {
          let max = this.getSDUSDMax();
          this.settleForm.SDUSD = this.settleForm.SDUSD > max ? max : this.settleForm.SDUSD;
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
            bigmath.chain(bigmath.bignumber(this.settleForm.SDUSD))
              .multiply(bigmath.bignumber(bigmath.pow(10, 8)))
              .done()
          ), 0
        );

        let scAddr = this.sarAddr.sarC.hash;
        let type = 'rescue';
        let params = [
          "(addr)" + this.currentSar.addr,
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
      setRowStyle(row) {
        if (row.row.status === '3') {
          return 'red'
        }
      },

      getCirDiscountRate() {
        let currentRate = this.currentSar.ratioAvail;
        currentRate = +currentRate;

        let cirDiscountRate = Math.ceil(100 / currentRate);

        let discountRate = this.sarConfig.liquidate_dis_rate_c;
        return cirDiscountRate > discountRate ? cirDiscountRate : discountRate;
      },

      //history detail
      async getHistoryDetail(item) {
        let params = [item.sarTxid, 10000, 1];
        let _historyList = await
          getSarCHistory(params);
        let historyList = _historyList.result;
        if (historyList) {
          this.historyList = historyList;
        } else {
          this.historyList = [];
        }
        this.historyModal = true;
      },
    },
    watch: {
      perPageNum() {
        this.loading = true;
        this.getSarCList(1);
        this.currentPage = 1;
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

  .recover-modal-info {
    padding: 80px 0;
    text-align: center;
    line-height: 20px
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

<style lang="scss">
  @import "../../assets/styles/var";

  .no-header-modal {
    .el-dialog__header {
      display: none;
    }
  }

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
